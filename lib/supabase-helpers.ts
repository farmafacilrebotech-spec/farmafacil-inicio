import { supabase } from './supabaseClient'

// ============================================
// TIPOS
// ============================================

// Tipos de métodos de pago disponibles
export type MetodoPago = 'bizum' | 'tarjeta' | 'transferencia' | 'efectivo'

export interface Farmacia {
  id: string
  codigo: string
  nombre: string
  email: string
  telefono?: string
  direccion?: string
  ciudad?: string
  codigo_postal?: string
  latitud?: number
  longitud?: number
  qr_url?: string
  logo_url?: string
  activa: boolean
  created_at: string
  updated_at: string
  // Métodos de pago
  metodos_pago: MetodoPago[]
  bizum_telefono?: string       // Teléfono para recibir Bizum
  iban?: string                 // IBAN para transferencias
  titular_cuenta?: string       // Nombre del titular de la cuenta
  stripe_account_id?: string    // ID de Stripe Connect (para tarjetas)
}

export interface Producto {
  id: string
  farmacia_id: string
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  categoria?: string
  imagen_url?: string
  codigo_barras?: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Cliente {
  id: string
  email: string
  nombre: string
  telefono?: string
  direccion?: string
  ciudad?: string
  codigo_postal?: string
  latitud?: number
  longitud?: number
  created_at: string
}

export interface Pedido {
  id: string
  cliente_id: string
  farmacia_id: string
  estado: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado'
  total: number
  direccion_entrega?: string
  notas?: string
  created_at: string
  updated_at: string
}

export interface PedidoItem {
  id: string
  pedido_id: string
  producto_id: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

// ============================================
// FARMACIAS MOCK (para desarrollo)
// ============================================

const FARMACIAS_MOCK: Farmacia[] = [
  {
    id: 'farm_001',
    codigo: 'sanmiguel',
    nombre: 'Farmacia San Miguel',
    email: 'sanmiguel@farmafacil.es',
    telefono: '961234567',
    direccion: 'Calle Mayor 15',
    ciudad: 'Valencia',
    codigo_postal: '46001',
    latitud: 39.4699,
    longitud: -0.3763,
    activa: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Métodos de pago
    metodos_pago: ['bizum', 'transferencia', 'efectivo'],
    bizum_telefono: '600123456',
    iban: 'ES91 2100 0418 4502 0005 1332',
    titular_cuenta: 'Farmacia San Miguel S.L.',
  },
  {
    id: 'farm_002',
    codigo: 'central',
    nombre: 'Farmacia Central',
    email: 'central@farmafacil.es',
    telefono: '961234568',
    direccion: 'Plaza del Ayuntamiento 3',
    ciudad: 'Valencia',
    codigo_postal: '46002',
    latitud: 39.4702,
    longitud: -0.3768,
    activa: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Métodos de pago
    metodos_pago: ['tarjeta', 'bizum', 'efectivo'],
    bizum_telefono: '600234567',
    stripe_account_id: 'acct_demo_central',
  },
  {
    id: 'farm_003',
    codigo: 'saludplus',
    nombre: 'Farmacia Salud Plus',
    email: 'saludplus@farmafacil.es',
    telefono: '961234569',
    direccion: 'Avenida del Puerto 45',
    ciudad: 'Valencia',
    codigo_postal: '46021',
    latitud: 39.4589,
    longitud: -0.3350,
    activa: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Métodos de pago
    metodos_pago: ['bizum', 'transferencia'],
    bizum_telefono: '600345678',
    iban: 'ES76 0049 1500 0512 3456 7891',
    titular_cuenta: 'Farmacia Salud Plus S.L.',
  },
  {
    id: 'farm_004',
    codigo: 'ruzafa',
    nombre: 'Farmacia Ruzafa',
    email: 'ruzafa@farmafacil.es',
    telefono: '961234570',
    direccion: 'Calle Cuba 12',
    ciudad: 'Valencia',
    codigo_postal: '46006',
    latitud: 39.4615,
    longitud: -0.3720,
    activa: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Métodos de pago
    metodos_pago: ['efectivo', 'bizum'],
    bizum_telefono: '600456789',
  },
  {
    id: 'farm_005',
    codigo: 'benimaclet',
    nombre: 'Farmacia Benimaclet',
    email: 'benimaclet@farmafacil.es',
    telefono: '961234571',
    direccion: 'Calle Emilio Baró 22',
    ciudad: 'Valencia',
    codigo_postal: '46020',
    latitud: 39.4850,
    longitud: -0.3600,
    activa: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Métodos de pago
    metodos_pago: ['tarjeta', 'transferencia', 'efectivo'],
    iban: 'ES68 0081 0200 2900 0011 2233',
    titular_cuenta: 'Farmacia Benimaclet C.B.',
    stripe_account_id: 'acct_demo_benimaclet',
  },
]

// Flag para usar datos mock (cambiar a false cuando Supabase esté configurado)
const USE_MOCK_DATA = true

// ============================================
// FARMACIAS
// ============================================

/**
 * Obtiene todas las farmacias activas
 */
export async function getFarmacias(): Promise<Farmacia[]> {
  // Usar datos mock para desarrollo
  if (USE_MOCK_DATA) {
    return FARMACIAS_MOCK
  }

  const { data, error } = await supabase
    .from('farmacias')
    .select('*')
    .eq('activa', true)
    .order('nombre')

  if (error) {
    console.error('Error al obtener farmacias:', error)
    // Fallback a datos mock si hay error
    return FARMACIAS_MOCK
  }

  return data || []
}

/**
 * Obtiene una farmacia por su código único
 */
export async function getFarmaciaByCodigo(codigo: string): Promise<Farmacia | null> {
  // Usar datos mock para desarrollo
  if (USE_MOCK_DATA) {
    return FARMACIAS_MOCK.find(f => f.codigo === codigo) || null
  }

  const { data, error } = await supabase
    .from('farmacias')
    .select('*')
    .eq('codigo', codigo)
    .eq('activa', true)
    .single()

  if (error) {
    console.error('Error al obtener farmacia por código:', error)
    // Fallback a datos mock
    return FARMACIAS_MOCK.find(f => f.codigo === codigo) || null
  }

  return data
}

/**
 * Obtiene una farmacia por su ID
 */
export async function getFarmaciaById(id: string): Promise<Farmacia | null> {
  // Usar datos mock para desarrollo
  if (USE_MOCK_DATA) {
    return FARMACIAS_MOCK.find(f => f.id === id) || null
  }

  const { data, error } = await supabase
    .from('farmacias')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error al obtener farmacia por ID:', error)
    // Fallback a datos mock
    return FARMACIAS_MOCK.find(f => f.id === id) || null
  }

  return data
}

/**
 * Verifica si un código de farmacia está disponible
 */
export async function verificarCodigoDisponible(codigo: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('farmacias')
    .select('id')
    .eq('codigo', codigo)
    .single()

  // Si no hay datos y el error es "no rows", el código está disponible
  return !data && error?.code === 'PGRST116'
}

// ============================================
// PRODUCTOS
// ============================================

/**
 * Obtiene todos los productos activos
 */
export async function getProductos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('nombre')

  if (error) {
    console.error('Error al obtener productos:', error)
    return []
  }

  return data || []
}

/**
 * Obtiene productos de una farmacia específica
 */
export async function getProductosByFarmacia(farmaciaId: string): Promise<Producto[]> {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('farmacia_id', farmaciaId)
    .eq('activo', true)
    .order('nombre')

  if (error) {
    console.error('Error al obtener productos de farmacia:', error)
    return []
  }

  return data || []
}

/**
 * Obtiene productos por código de farmacia
 */
export async function getProductosByCodigo(codigoFarmacia: string): Promise<Producto[]> {
  const farmacia = await getFarmaciaByCodigo(codigoFarmacia)
  if (!farmacia) return []

  return getProductosByFarmacia(farmacia.id)
}

/**
 * Busca productos por nombre
 */
export async function searchProductos(query: string, farmaciaId?: string): Promise<Producto[]> {
  let queryBuilder = supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .ilike('nombre', `%${query}%`)

  if (farmaciaId) {
    queryBuilder = queryBuilder.eq('farmacia_id', farmaciaId)
  }

  const { data, error } = await queryBuilder.limit(20)

  if (error) {
    console.error('Error al buscar productos:', error)
    return []
  }

  return data || []
}

// ============================================
// CLIENTES
// ============================================

/**
 * Obtiene un cliente por email
 */
export async function getClienteByEmail(email: string): Promise<Cliente | null> {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    console.error('Error al obtener cliente:', error)
    return null
  }

  return data
}

/**
 * Crea o actualiza un cliente
 */
export async function upsertCliente(cliente: Partial<Cliente>): Promise<Cliente | null> {
  const { data, error } = await supabase
    .from('clientes')
    .upsert(cliente, { onConflict: 'email' })
    .select()
    .single()

  if (error) {
    console.error('Error al crear/actualizar cliente:', error)
    return null
  }

  return data
}

// ============================================
// PEDIDOS
// ============================================

interface CreatePedidoParams {
  cliente_id: string
  farmacia_id: string
  items: Array<{
    producto_id: string
    cantidad: number
    precio_unitario: number
  }>
  direccion_entrega?: string
  notas?: string
}

/**
 * Crea un nuevo pedido con sus items
 */
export async function createPedido(params: CreatePedidoParams): Promise<Pedido | null> {
  const { cliente_id, farmacia_id, items, direccion_entrega, notas } = params

  // Calcular total
  const total = items.reduce(
    (sum, item) => sum + item.cantidad * item.precio_unitario,
    0
  )

  // Insertar pedido
  const { data: newPedido, error: pedidoError } = await supabase
    .from('pedidos')
    .insert({
      cliente_id,
      farmacia_id,
      total,
      direccion_entrega,
      notas,
    })
    .select()
    .single()

  if (pedidoError || !newPedido) {
    console.error('Error al crear pedido:', pedidoError)
    return null
  }

  // Insertar items
  const pedidoItems = items.map((item) => ({
    pedido_id: newPedido.id,
    producto_id: item.producto_id,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
    subtotal: item.cantidad * item.precio_unitario,
  }))

  const { error: itemsError } = await supabase
    .from('pedido_items')
    .insert(pedidoItems)

  if (itemsError) {
    console.error('Error al crear items del pedido:', itemsError)
    // TODO: Rollback del pedido si falla
  }

  return newPedido
}

/**
 * Obtiene pedidos de un cliente
 */
export async function getPedidosByCliente(clienteId: string): Promise<Pedido[]> {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      farmacias(nombre, codigo),
      pedido_items(
        cantidad,
        precio_unitario,
        subtotal,
        productos(nombre, imagen_url)
      )
    `)
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener pedidos del cliente:', error)
    return []
  }

  return data || []
}

/**
 * Obtiene pedidos de una farmacia
 */
export async function getPedidosByFarmacia(farmaciaId: string): Promise<Pedido[]> {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      clientes(nombre, email, telefono),
      pedido_items(
        cantidad,
        precio_unitario,
        subtotal,
        productos(nombre)
      )
    `)
    .eq('farmacia_id', farmaciaId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener pedidos de la farmacia:', error)
    return []
  }

  return data || []
}

/**
 * Actualiza el estado de un pedido
 */
export async function updatePedidoEstado(
  pedidoId: string,
  estado: Pedido['estado']
): Promise<Pedido | null> {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ estado })
    .eq('id', pedidoId)
    .select()
    .single()

  if (error) {
    console.error('Error al actualizar estado del pedido:', error)
    return null
  }

  return data
}

