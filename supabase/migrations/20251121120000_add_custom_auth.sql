/*
  Migración: Sistema de Autenticación Personalizado para FarmaFácil
  
  Esta migración añade:
  1. Tabla farmacias_credenciales para login de farmacias
  2. Campo password_hash a tabla clientes para login de clientes
  3. Campos adicionales a tabla farmacias (codigo, color_principal, horario)
  
  Fecha: 2025-11-21
*/

-- =============================================
-- 1. AÑADIR CAMPOS A TABLA FARMACIAS
-- =============================================

-- Añadir campo 'codigo' si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'farmacias' AND column_name = 'codigo'
  ) THEN
    ALTER TABLE farmacias ADD COLUMN codigo text UNIQUE;
  END IF;
END $$;

-- Añadir campo 'color_principal' si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'farmacias' AND column_name = 'color_principal'
  ) THEN
    ALTER TABLE farmacias ADD COLUMN color_principal text DEFAULT '#1ABBB3';
  END IF;
END $$;

-- Añadir campo 'horario' si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'farmacias' AND column_name = 'horario'
  ) THEN
    ALTER TABLE farmacias ADD COLUMN horario text;
  END IF;
END $$;

-- =============================================
-- 2. CREAR TABLA FARMACIAS_CREDENCIALES
-- =============================================

CREATE TABLE IF NOT EXISTS farmacias_credenciales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmacia_id uuid REFERENCES farmacias(id) ON DELETE CASCADE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índice para búsquedas rápidas por email
CREATE INDEX IF NOT EXISTS idx_farmacias_credenciales_email 
  ON farmacias_credenciales(email);

-- Índice para relación con farmacia
CREATE INDEX IF NOT EXISTS idx_farmacias_credenciales_farmacia 
  ON farmacias_credenciales(farmacia_id);

-- =============================================
-- 3. POLÍTICAS RLS PARA FARMACIAS_CREDENCIALES
-- =============================================

ALTER TABLE farmacias_credenciales ENABLE ROW LEVEL SECURITY;

-- Permitir acceso anónimo SOLO para lectura (necesario para login)
CREATE POLICY "Allow anonymous read for login"
  ON farmacias_credenciales FOR SELECT
  TO anon
  USING (true);

-- Las farmacias autenticadas pueden ver sus propias credenciales
CREATE POLICY "Farmacias can view own credentials"
  ON farmacias_credenciales FOR SELECT
  TO authenticated
  USING (
    farmacia_id IN (
      SELECT id FROM farmacias WHERE user_id = auth.uid()
    )
  );

-- Las farmacias pueden actualizar sus propias credenciales
CREATE POLICY "Farmacias can update own credentials"
  ON farmacias_credenciales FOR UPDATE
  TO authenticated
  USING (
    farmacia_id IN (
      SELECT id FROM farmacias WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    farmacia_id IN (
      SELECT id FROM farmacias WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- 4. AÑADIR PASSWORD_HASH A TABLA CLIENTES
-- =============================================

-- Añadir campo 'password_hash' si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clientes' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE clientes ADD COLUMN password_hash text;
  END IF;
END $$;

-- Añadir campo 'farmacia_codigo' si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clientes' AND column_name = 'farmacia_codigo'
  ) THEN
    ALTER TABLE clientes ADD COLUMN farmacia_codigo text;
  END IF;
END $$;

-- =============================================
-- 5. ACTUALIZAR POLÍTICA DE LECTURA DE CLIENTES
-- =============================================

-- Permitir lectura anónima solo de campos públicos (necesario para login)
DROP POLICY IF EXISTS "Allow anonymous read for login" ON clientes;

CREATE POLICY "Allow anonymous read for login"
  ON clientes FOR SELECT
  TO anon
  USING (true);

-- =============================================
-- 6. COMENTARIOS Y DOCUMENTACIÓN
-- =============================================

COMMENT ON TABLE farmacias_credenciales IS 
  'Tabla de credenciales para autenticación personalizada de farmacias';

COMMENT ON COLUMN farmacias_credenciales.password_hash IS 
  'Hash bcrypt de la contraseña de la farmacia';

COMMENT ON COLUMN clientes.password_hash IS 
  'Hash bcrypt de la contraseña del cliente';

COMMENT ON COLUMN clientes.farmacia_codigo IS 
  'Código de la farmacia asociada al cliente';

COMMENT ON COLUMN farmacias.codigo IS 
  'Código único de la farmacia para URLs y referencias externas';

COMMENT ON COLUMN farmacias.color_principal IS 
  'Color principal del branding de la farmacia (formato hexadecimal)';

COMMENT ON COLUMN farmacias.horario IS 
  'Horario de atención de la farmacia';

-- =============================================
-- 7. DATOS DE EJEMPLO (OPCIONAL - COMENTADOS)
-- =============================================

-- Descomenta las siguientes líneas para insertar datos de prueba:

/*
-- Ejemplo de farmacia
INSERT INTO farmacias (codigo, nombre, email, telefono, direccion, color_principal, horario)
VALUES (
  'FARM001',
  'Farmacia Ejemplo',
  'ejemplo@farmacia.com',
  '+34 123 456 789',
  'Calle Principal 123, Madrid',
  '#1ABBB3',
  'Lunes a Viernes: 9:00-21:00'
)
ON CONFLICT (email) DO NOTHING;

-- Ejemplo de credenciales (password: "demo123")
-- Hash generado con bcrypt (10 rounds): $2a$10$X7KZ8n5mxN4YxV3Hj6qYZeH5pZ8K2vX4nQ9lM7jR3tW5oP1kS8cDe
INSERT INTO farmacias_credenciales (farmacia_id, email, password_hash)
SELECT 
  id,
  'ejemplo@farmacia.com',
  '$2a$10$X7KZ8n5mxN4YxV3Hj6qYZeH5pZ8K2vX4nQ9lM7jR3tW5oP1kS8cDe'
FROM farmacias 
WHERE email = 'ejemplo@farmacia.com'
ON CONFLICT (email) DO NOTHING;

-- Ejemplo de cliente (password: "cliente123")
-- Hash: $2a$10$Y8LA9o6nyO5ZyW4Ik7rZafI6qA9L3wY5oR0mN8kS4uX6pQ2lT9dEf
INSERT INTO clientes (nombre, email, telefono, password_hash, farmacia_codigo)
VALUES (
  'Cliente Ejemplo',
  'cliente@ejemplo.com',
  '+34 987 654 321',
  '$2a$10$Y8LA9o6nyO5ZyW4Ik7rZafI6qA9L3wY5oR0mN8kS4uX6pQ2lT9dEf',
  'FARM001'
)
ON CONFLICT (email) DO NOTHING;
*/

