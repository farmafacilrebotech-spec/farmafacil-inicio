/*
  Migración: Tabla de Productos para Catálogo de Farmacias
  
  Esta migración crea la tabla productos con todos los campos necesarios
  para gestionar el catálogo de productos de cada farmacia.
  
  Fecha: 2025-11-21
  Fase: 3 - Sincronizador de Catálogo Excel
*/

-- =============================================
-- ELIMINAR TABLA SI EXISTE (RECREAR LIMPIA)
-- =============================================

DROP TABLE IF EXISTS productos CASCADE;

-- =============================================
-- CREAR TABLA PRODUCTOS
-- =============================================

CREATE TABLE productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmacia_id text NOT NULL,
  nombre text NOT NULL,
  categoria text,
  precio numeric(10,2) DEFAULT 0,
  pvp numeric(10,2) DEFAULT 0,
  imagen_url text,
  stock integer DEFAULT 0,
  codigo_barras text,
  laboratorio text,
  updated_at timestamptz DEFAULT now(),
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Índice compuesto para UPSERT (farmacia_id + codigo_barras)
CREATE UNIQUE INDEX idx_productos_farmacia_barras 
  ON productos(farmacia_id, codigo_barras) 
  WHERE codigo_barras IS NOT NULL;

-- Índice para búsquedas por farmacia
CREATE INDEX idx_productos_farmacia 
  ON productos(farmacia_id);

-- Índice para búsquedas por categoría
CREATE INDEX idx_productos_categoria 
  ON productos(categoria);

-- Índice para productos activos
CREATE INDEX idx_productos_activo 
  ON productos(activo);

-- Índice para búsqueda por nombre (texto)
CREATE INDEX idx_productos_nombre 
  ON productos USING gin(to_tsvector('spanish', nombre));

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Permitir lectura anónima (clientes viendo catálogo)
CREATE POLICY "Allow anonymous read productos"
  ON productos FOR SELECT
  TO anon
  USING (activo = true);

-- Permitir lectura autenticada
CREATE POLICY "Allow authenticated read productos"
  ON productos FOR SELECT
  TO authenticated
  USING (true);

-- Permitir operaciones de escritura solo al service role
CREATE POLICY "Allow service role all access"
  ON productos FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================
-- FUNCIÓN PARA ACTUALIZAR updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_productos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar automáticamente updated_at
CREATE TRIGGER trigger_update_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION update_productos_updated_at();

-- =============================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- =============================================

COMMENT ON TABLE productos IS 
  'Catálogo de productos de farmacias';

COMMENT ON COLUMN productos.farmacia_id IS 
  'ID de la farmacia propietaria del producto';

COMMENT ON COLUMN productos.nombre IS 
  'Nombre del producto';

COMMENT ON COLUMN productos.categoria IS 
  'Categoría del producto (ej: Medicamentos, Higiene, etc.)';

COMMENT ON COLUMN productos.precio IS 
  'Precio de coste del producto';

COMMENT ON COLUMN productos.pvp IS 
  'Precio de venta al público';

COMMENT ON COLUMN productos.imagen_url IS 
  'URL de la imagen del producto';

COMMENT ON COLUMN productos.stock IS 
  'Cantidad disponible en stock';

COMMENT ON COLUMN productos.codigo_barras IS 
  'Código de barras EAN del producto';

COMMENT ON COLUMN productos.laboratorio IS 
  'Laboratorio o marca fabricante';

COMMENT ON COLUMN productos.activo IS 
  'Indica si el producto está activo en el catálogo';

-- =============================================
-- DATOS DE EJEMPLO (OPCIONAL - COMENTADOS)
-- =============================================

/*
-- Ejemplo de productos
INSERT INTO productos (farmacia_id, nombre, categoria, precio, pvp, stock, codigo_barras, laboratorio, activo)
VALUES 
  ('FARM001', 'Paracetamol 1g', 'Medicamentos', 2.50, 3.95, 100, '8470001234567', 'Laboratorio Ejemplo', true),
  ('FARM001', 'Ibuprofeno 600mg', 'Medicamentos', 3.20, 4.85, 75, '8470007654321', 'Laboratorio Ejemplo', true),
  ('FARM001', 'Crema Hidratante 200ml', 'Cosmética', 8.50, 12.95, 50, '8470009876543', 'Marca Cosmética', true);
*/

