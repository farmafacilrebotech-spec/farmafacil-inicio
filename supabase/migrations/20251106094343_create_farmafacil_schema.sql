/*
  # FarmaFácil Database Schema

  1. New Tables
    - `farmacias`
      - `id` (uuid, primary key)
      - `nombre` (text) - Pharmacy name
      - `email` (text, unique) - Contact email
      - `telefono` (text) - Phone number
      - `whatsapp` (text) - WhatsApp number
      - `direccion` (text) - Physical address
      - `logo_url` (text) - Logo image URL
      - `user_id` (uuid) - Reference to auth.users
      - `created_at` (timestamptz)
    
    - `clientes`
      - `id` (uuid, primary key)
      - `nombre` (text) - Customer name
      - `email` (text, unique) - Contact email
      - `telefono` (text) - Phone number
      - `user_id` (uuid) - Reference to auth.users
      - `created_at` (timestamptz)
    
    - `productos`
      - `id` (uuid, primary key)
      - `farmacia_id` (uuid) - Reference to farmacias
      - `nombre` (text) - Product name
      - `descripcion` (text) - Product description
      - `categoria` (text) - Product category
      - `stock` (integer) - Available stock
      - `precio` (numeric) - Product price
      - `imagen_url` (text) - Product image URL
      - `created_at` (timestamptz)
    
    - `pedidos`
      - `id` (uuid, primary key)
      - `cliente_id` (uuid) - Reference to clientes
      - `farmacia_id` (uuid) - Reference to farmacias
      - `fecha` (timestamptz) - Order date
      - `total` (numeric) - Order total amount
      - `estado` (text) - Order status (Pendiente, Enviado, Completado)
      - `created_at` (timestamptz)
    
    - `detalles_pedido`
      - `id` (uuid, primary key)
      - `pedido_id` (uuid) - Reference to pedidos
      - `producto_id` (uuid) - Reference to productos
      - `cantidad` (integer) - Quantity ordered
      - `subtotal` (numeric) - Line item subtotal
      - `created_at` (timestamptz)
    
    - `conversaciones`
      - `id` (uuid, primary key)
      - `farmacia_id` (uuid) - Reference to farmacias
      - `cliente_id` (uuid) - Reference to clientes (nullable)
      - `fecha` (timestamptz) - Conversation date
      - `mensaje_usuario` (text) - User message
      - `respuesta_ia` (text) - AI response
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Farmacias can manage their own data
    - Clientes can view products and manage their orders
*/

-- Create farmacias table
CREATE TABLE IF NOT EXISTS farmacias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text UNIQUE NOT NULL,
  telefono text,
  whatsapp text,
  direccion text,
  logo_url text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE farmacias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmacias can view own data"
  ON farmacias FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Farmacias can update own data"
  ON farmacias FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view farmacias"
  ON farmacias FOR SELECT
  TO anon
  USING (true);

-- Create clientes table
CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text UNIQUE NOT NULL,
  telefono text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes can view own data"
  ON clientes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Clientes can update own data"
  ON clientes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create productos table
CREATE TABLE IF NOT EXISTS productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmacia_id uuid REFERENCES farmacias(id) ON DELETE CASCADE NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  categoria text NOT NULL DEFAULT 'General',
  stock integer NOT NULL DEFAULT 0,
  precio numeric(10,2) NOT NULL DEFAULT 0,
  imagen_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view productos"
  ON productos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Farmacias can manage own productos"
  ON productos FOR ALL
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

-- Create pedidos table
CREATE TABLE IF NOT EXISTS pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  farmacia_id uuid REFERENCES farmacias(id) ON DELETE CASCADE NOT NULL,
  fecha timestamptz DEFAULT now(),
  total numeric(10,2) NOT NULL DEFAULT 0,
  estado text NOT NULL DEFAULT 'Pendiente',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes can view own pedidos"
  ON pedidos FOR SELECT
  TO authenticated
  USING (
    cliente_id IN (
      SELECT id FROM clientes WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Farmacias can view their pedidos"
  ON pedidos FOR SELECT
  TO authenticated
  USING (
    farmacia_id IN (
      SELECT id FROM farmacias WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Farmacias can update their pedidos"
  ON pedidos FOR UPDATE
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

CREATE POLICY "Clientes can create pedidos"
  ON pedidos FOR INSERT
  TO authenticated
  WITH CHECK (
    cliente_id IN (
      SELECT id FROM clientes WHERE user_id = auth.uid()
    )
  );

-- Create detalles_pedido table
CREATE TABLE IF NOT EXISTS detalles_pedido (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid REFERENCES pedidos(id) ON DELETE CASCADE NOT NULL,
  producto_id uuid REFERENCES productos(id) ON DELETE CASCADE NOT NULL,
  cantidad integer NOT NULL DEFAULT 1,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE detalles_pedido ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view detalles of their pedidos"
  ON detalles_pedido FOR SELECT
  TO authenticated
  USING (
    pedido_id IN (
      SELECT id FROM pedidos WHERE 
        cliente_id IN (SELECT id FROM clientes WHERE user_id = auth.uid())
        OR farmacia_id IN (SELECT id FROM farmacias WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Clientes can insert detalles_pedido"
  ON detalles_pedido FOR INSERT
  TO authenticated
  WITH CHECK (
    pedido_id IN (
      SELECT id FROM pedidos WHERE cliente_id IN (
        SELECT id FROM clientes WHERE user_id = auth.uid()
      )
    )
  );

-- Create conversaciones table
CREATE TABLE IF NOT EXISTS conversaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmacia_id uuid REFERENCES farmacias(id) ON DELETE CASCADE NOT NULL,
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  fecha timestamptz DEFAULT now(),
  mensaje_usuario text NOT NULL,
  respuesta_ia text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE conversaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmacias can view own conversaciones"
  ON conversaciones FOR SELECT
  TO authenticated
  USING (
    farmacia_id IN (
      SELECT id FROM farmacias WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clientes can view own conversaciones"
  ON conversaciones FOR SELECT
  TO authenticated
  USING (
    cliente_id IN (
      SELECT id FROM clientes WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create conversaciones"
  ON conversaciones FOR INSERT
  TO authenticated
  WITH CHECK (
    farmacia_id IN (SELECT id FROM farmacias WHERE user_id = auth.uid())
    OR cliente_id IN (SELECT id FROM clientes WHERE user_id = auth.uid())
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_productos_farmacia ON productos(farmacia_id);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_farmacia ON pedidos(farmacia_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_detalles_pedido ON detalles_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_farmacia ON conversaciones(farmacia_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_cliente ON conversaciones(cliente_id);