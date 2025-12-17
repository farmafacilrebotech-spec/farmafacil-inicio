import { NextResponse } from 'next/server'

// Datos mock de farmacias (en producción, usar Supabase)
const FARMACIAS_MOCK = [
  {
    id: 'farm_1',
    codigo: 'FARM001',
    nombre: 'Farmacia San Miguel',
    email: 'sanmiguel@farmacia.com',
    telefono: '+34 961 234 567',
    direccion: 'Calle Mayor 123',
    ciudad: 'Valencia',
    codigo_postal: '46001',
    latitud: 39.4699,
    longitud: -0.3763,
    logo_url: null,
    activa: true,
  },
  {
    id: 'farm_2',
    codigo: 'FARM002',
    nombre: 'Farmacia Central',
    email: 'central@farmacia.com',
    telefono: '+34 961 345 678',
    direccion: 'Plaza del Ayuntamiento 5',
    ciudad: 'Valencia',
    codigo_postal: '46002',
    latitud: 39.4697,
    longitud: -0.3774,
    logo_url: null,
    activa: true,
  },
  {
    id: 'farm_3',
    codigo: 'SALUD123',
    nombre: 'Farmacia Salud Plus',
    email: 'saludplus@farmacia.com',
    telefono: '+34 961 456 789',
    direccion: 'Avenida del Puerto 45',
    ciudad: 'Valencia',
    codigo_postal: '46023',
    latitud: 39.4589,
    longitud: -0.3344,
    logo_url: null,
    activa: true,
  },
]

export async function GET(
  request: Request,
  { params }: { params: { codigo: string } }
) {
  try {
    const { codigo } = params

    if (!codigo) {
      return NextResponse.json(
        { success: false, error: 'Código de farmacia requerido' },
        { status: 400 }
      )
    }

    // Buscar farmacia por código (case insensitive)
    const farmacia = FARMACIAS_MOCK.find(
      (f) => f.codigo.toUpperCase() === codigo.toUpperCase() && f.activa
    )

    if (!farmacia) {
      return NextResponse.json(
        { success: false, error: 'Farmacia no encontrada' },
        { status: 404 }
      )
    }

    // No devolver información sensible
    const { email, ...farmaciaPublica } = farmacia

    return NextResponse.json({
      success: true,
      farmacia: farmaciaPublica,
    })
  } catch (error) {
    console.error('Error al obtener farmacia:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

