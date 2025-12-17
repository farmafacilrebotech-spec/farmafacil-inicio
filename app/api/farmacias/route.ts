import { NextResponse } from 'next/server'

// Datos mock de farmacias (en producción, usar Supabase)
const FARMACIAS_MOCK = [
  {
    id: 'farm_1',
    codigo: 'FARM001',
    nombre: 'Farmacia San Miguel',
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

export async function GET() {
  try {
    // Filtrar solo farmacias activas
    const farmacias = FARMACIAS_MOCK.filter((f) => f.activa)

    return NextResponse.json({
      success: true,
      farmacias,
      total: farmacias.length,
    })
  } catch (error) {
    console.error('Error al obtener farmacias:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

