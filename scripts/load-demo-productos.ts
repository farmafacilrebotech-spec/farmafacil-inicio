/**
 * Script para cargar productos demo en Supabase
 * 
 * Uso:
 * 1. Asegúrate de tener las variables de entorno configuradas
 * 2. Ejecuta: npx tsx scripts/load-demo-productos.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function loadDemoProductos() {
  try {
    console.log('📦 Cargando productos demo...\n');

    // Leer archivo JSON
    const jsonPath = path.join(process.cwd(), 'public', 'demo', 'catalogo_supabase.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(jsonData);

    const productos = data.productos;

    console.log(`📋 Total de productos a cargar: ${productos.length}\n`);

    let insertados = 0;
    let actualizados = 0;
    let errores = 0;

    // Procesar cada producto
    for (const producto of productos) {
      try {
        // Verificar si existe (por código de barras)
        const { data: existente } = await supabase
          .from('productos')
          .select('id')
          .eq('farmacia_id', producto.farmacia_id)
          .eq('codigo_barras', producto.codigo_barras)
          .single();

        if (existente) {
          // Actualizar
          const { error } = await supabase
            .from('productos')
            .update(producto)
            .eq('farmacia_id', producto.farmacia_id)
            .eq('codigo_barras', producto.codigo_barras);

          if (error) {
            console.error(`❌ Error actualizando ${producto.nombre}:`, error.message);
            errores++;
          } else {
            console.log(`🔄 Actualizado: ${producto.nombre}`);
            actualizados++;
          }
        } else {
          // Insertar
          const { error } = await supabase
            .from('productos')
            .insert(producto);

          if (error) {
            console.error(`❌ Error insertando ${producto.nombre}:`, error.message);
            errores++;
          } else {
            console.log(`✅ Insertado: ${producto.nombre}`);
            insertados++;
          }
        }
      } catch (error: any) {
        console.error(`❌ Error procesando ${producto.nombre}:`, error.message);
        errores++;
      }
    }

    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE CARGA');
    console.log('='.repeat(60));
    console.log(`✅ Productos insertados: ${insertados}`);
    console.log(`🔄 Productos actualizados: ${actualizados}`);
    console.log(`❌ Errores: ${errores}`);
    console.log(`📦 Total procesados: ${insertados + actualizados + errores}`);
    console.log('='.repeat(60) + '\n');

    if (errores === 0) {
      console.log('🎉 ¡Carga completada exitosamente!\n');
    } else {
      console.log('⚠️  Carga completada con algunos errores\n');
    }

  } catch (error: any) {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  }
}

// Ejecutar
loadDemoProductos();

