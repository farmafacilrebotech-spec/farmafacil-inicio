/**
 * Excel Mapper - Mapeo inteligente de columnas de Excel a estructura de productos
 * 
 * Este módulo permite procesar archivos Excel con diferentes formatos de columnas
 * y mapearlos automáticamente a la estructura estándar de productos.
 */

export interface ProductoExcel {
  nombre: string;
  categoria?: string;
  precio?: number;
  pvp?: number;
  stock?: number;
  codigo_barras?: string;
  laboratorio?: string;
}

export interface ColumnMapping {
  nombre?: string;
  categoria?: string;
  precio?: string;
  pvp?: string;
  stock?: string;
  codigo_barras?: string;
  laboratorio?: string;
}

/**
 * Normaliza un string eliminando acentos, espacios y caracteres especiales
 */
export function normalizeString(str: string): string {
  if (!str) return '';
  
  return str
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]/g, ''); // Solo letras y números
}

/**
 * Detecta automáticamente las columnas del Excel basándose en patrones conocidos
 */
export function detectColumns(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};

  // Patrones para cada campo
  const patterns = {
    nombre: ['nombre', 'product', 'articulo', 'item', 'descripcion', 'description', 'producto'],
    categoria: ['categoria', 'category', 'family', 'familia', 'seccion', 'grupo', 'tipo'],
    precio: ['precio', 'price', 'coste', 'cost', 'precioc', 'pc'],
    pvp: ['pvp', 'preciov', 'pv', 'precioventa', 'venta', 'sale', 'retail'],
    stock: ['stock', 'inventario', 'cantidad', 'existencias', 'disponible', 'qty', 'quantity'],
    codigo_barras: ['codigobarras', 'ean', 'barcode', 'codigo', 'code', 'upc', 'cn'],
    laboratorio: ['laboratorio', 'marca', 'brand', 'fabricante', 'manufacturer', 'proveedor'],
  };

  // Normalizar headers
  const normalizedHeaders = headers.map(h => normalizeString(h));

  // Para cada campo, buscar coincidencias
  for (const [field, fieldPatterns] of Object.entries(patterns)) {
    for (let i = 0; i < normalizedHeaders.length; i++) {
      const normalized = normalizedHeaders[i];
      
      // Buscar si algún patrón coincide
      const match = fieldPatterns.some(pattern => normalized.includes(pattern));
      
      if (match) {
        mapping[field as keyof ColumnMapping] = headers[i];
        break; // Ya encontramos la columna para este campo
      }
    }
  }

  return mapping;
}

/**
 * Mapea una fila del Excel a un objeto ProductoExcel usando el columnMapping
 */
export function mapRow(row: any, columnMap: ColumnMapping): ProductoExcel | null {
  try {
    // El nombre es obligatorio
    const nombre = row[columnMap.nombre || ''];
    if (!nombre || nombre.toString().trim() === '') {
      return null; // Fila inválida, no tiene nombre
    }

    const producto: ProductoExcel = {
      nombre: nombre.toString().trim(),
    };

    // Mapear campos opcionales
    if (columnMap.categoria && row[columnMap.categoria]) {
      producto.categoria = row[columnMap.categoria].toString().trim();
    }

    if (columnMap.precio && row[columnMap.precio]) {
      const precio = parseFloat(row[columnMap.precio].toString().replace(',', '.'));
      if (!isNaN(precio)) producto.precio = precio;
    }

    if (columnMap.pvp && row[columnMap.pvp]) {
      const pvp = parseFloat(row[columnMap.pvp].toString().replace(',', '.'));
      if (!isNaN(pvp)) producto.pvp = pvp;
    }

    if (columnMap.stock && row[columnMap.stock]) {
      const stock = parseInt(row[columnMap.stock].toString());
      if (!isNaN(stock)) producto.stock = stock;
    }

    if (columnMap.codigo_barras && row[columnMap.codigo_barras]) {
      producto.codigo_barras = row[columnMap.codigo_barras].toString().trim();
    }

    if (columnMap.laboratorio && row[columnMap.laboratorio]) {
      producto.laboratorio = row[columnMap.laboratorio].toString().trim();
    }

    return producto;
  } catch (error) {
    console.error('Error mapeando fila:', error);
    return null;
  }
}

/**
 * Valida que el mapeo tenga al menos el campo nombre
 */
export function validateMapping(mapping: ColumnMapping): { valid: boolean; error?: string } {
  if (!mapping.nombre) {
    return {
      valid: false,
      error: 'No se pudo detectar la columna de nombre del producto. Asegúrate de que el Excel contenga una columna con el nombre del producto.',
    };
  }

  return { valid: true };
}

/**
 * Procesa todas las filas de un Excel y devuelve productos válidos
 */
export function processExcelData(
  data: any[],
  columnMap: ColumnMapping
): { productos: ProductoExcel[]; errores: string[] } {
  const productos: ProductoExcel[] = [];
  const errores: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const producto = mapRow(row, columnMap);

    if (producto) {
      productos.push(producto);
    } else {
      // Fila sin nombre, se salta
      if (i > 0) { // No contar header
        errores.push(`Fila ${i + 2}: No se pudo procesar (falta nombre o datos inválidos)`);
      }
    }
  }

  return { productos, errores };
}

