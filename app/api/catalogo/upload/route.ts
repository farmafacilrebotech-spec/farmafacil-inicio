import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabaseClient';
import {
  detectColumns,
  validateMapping,
  processExcelData,
  ProductoExcel,
} from '@/lib/excelMapper';

export async function POST(request: NextRequest) {
  try {
    // 1. Obtener FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const farmaciaId = formData.get('farmacia_id') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se recibió ningún archivo' },
        { status: 400 }
      );
    }

    if (!farmaciaId) {
      return NextResponse.json(
        { success: false, error: 'No se recibió el ID de farmacia' },
        { status: 400 }
      );
    }

    // 2. Validar tipo de archivo
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      return NextResponse.json(
        { success: false, error: 'El archivo debe ser un Excel (.xlsx o .xls)' },
        { status: 400 }
      );
    }

    // 3. Leer archivo Excel
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Tomar la primera hoja
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convertir a JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    if (!jsonData || jsonData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'El archivo Excel está vacío' },
        { status: 400 }
      );
    }

    // 4. Detectar columnas automáticamente
    const headers = Object.keys(jsonData[0] as object);
    const columnMap = detectColumns(headers);

    // 5. Validar mapeo
    const validation = validateMapping(columnMap);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // 6. Procesar datos del Excel
    const { productos, errores } = processExcelData(jsonData, columnMap);

    if (productos.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No se encontraron productos válidos en el archivo',
          errores,
        },
        { status: 400 }
      );
    }

    // 7. Hacer UPSERT en Supabase
    let inserted = 0;
    let updated = 0;
    const processingErrors: string[] = [];

    for (const producto of productos) {
      try {
        // Preparar datos para insertar
        const productoData = {
          farmacia_id: farmaciaId,
          nombre: producto.nombre,
          categoria: producto.categoria || 'Sin categoría',
          precio: producto.precio || 0,
          pvp: producto.pvp || producto.precio || 0,
          stock: producto.stock || 0,
          codigo_barras: producto.codigo_barras || null,
          laboratorio: producto.laboratorio || null,
          activo: true,
        };

        // Si tiene código de barras, intentar UPSERT
        if (producto.codigo_barras) {
          // Verificar si existe
          const { data: existing } = await supabase
            .from('productos')
            .select('id')
            .eq('farmacia_id', farmaciaId)
            .eq('codigo_barras', producto.codigo_barras)
            .single();

          if (existing) {
            // Actualizar
            const { error: updateError } = await supabase
              .from('productos')
              .update(productoData)
              .eq('farmacia_id', farmaciaId)
              .eq('codigo_barras', producto.codigo_barras);

            if (updateError) {
              processingErrors.push(`Error actualizando ${producto.nombre}: ${updateError.message}`);
            } else {
              updated++;
            }
          } else {
            // Insertar nuevo
            const { error: insertError } = await supabase
              .from('productos')
              .insert(productoData);

            if (insertError) {
              processingErrors.push(`Error insertando ${producto.nombre}: ${insertError.message}`);
            } else {
              inserted++;
            }
          }
        } else {
          // Sin código de barras, siempre insertar
          const { error: insertError } = await supabase
            .from('productos')
            .insert(productoData);

          if (insertError) {
            processingErrors.push(`Error insertando ${producto.nombre}: ${insertError.message}`);
          } else {
            inserted++;
          }
        }
      } catch (error: any) {
        processingErrors.push(`Error procesando ${producto.nombre}: ${error.message}`);
      }
    }

    // 8. Devolver resultado
    return NextResponse.json({
      success: true,
      inserted,
      updated,
      total: inserted + updated,
      errors: processingErrors,
      columnMap, // Para debug
    });
  } catch (error: any) {
    console.error('Error en upload de catálogo:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al procesar el archivo',
      },
      { status: 500 }
    );
  }
}

