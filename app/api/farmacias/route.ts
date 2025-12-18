import { NextResponse } from 'next/server'
import { getFarmacias, getFarmaciaById, getFarmaciaByCodigo } from '@/lib/supabase-helpers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const codigo = searchParams.get('codigo')

    // Si se pide una farmacia específica por ID
    if (id) {
      const farmacia = await getFarmaciaById(id)
      if (!farmacia) {
        return NextResponse.json(
          { success: false, error: 'Farmacia no encontrada' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        farmacia,
      })
    }

    // Si se pide una farmacia por código
    if (codigo) {
      const farmacia = await getFarmaciaByCodigo(codigo)
      if (!farmacia) {
        return NextResponse.json(
          { success: false, error: 'Farmacia no encontrada' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        farmacia,
      })
    }

    // Obtener todas las farmacias activas
    const farmacias = await getFarmacias()

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
