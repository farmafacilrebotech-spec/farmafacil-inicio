import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Limpiar cookies de sesión si las hubiera
    const cookieStore = cookies()
    
    // Eliminar posibles cookies de sesión
    cookieStore.delete('farmafacil_session')
    cookieStore.delete('farmacia_session')
    cookieStore.delete('cliente_session')

    return NextResponse.json({ 
      success: true, 
      message: 'Sesión cerrada correctamente' 
    })
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      { success: false, error: 'Error al cerrar sesión' },
      { status: 500 }
    )
  }
}

