import { NextResponse } from 'next/server'

interface PedidoItem {
  producto_id: string
  cantidad: number
  precio_unitario: number
}

interface CreatePedidoRequest {
  cliente_id: string
  farmacia_id: string
  items: PedidoItem[]
  direccion_entrega?: string
  notas?: string
}

// Almacenamiento temporal (en producción usar Supabase)
let pedidosDB: any[] = []
let pedidoCounter = 1

export async function POST(request: Request) {
  try {
    const data: CreatePedidoRequest = await request.json()

    // Validar datos requeridos
    if (!data.cliente_id || !data.farmacia_id || !data.items?.length) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Calcular total
    const total = data.items.reduce(
      (sum, item) => sum + item.cantidad * item.precio_unitario,
      0
    )

    // Crear pedido
    const nuevoPedido = {
      id: `pedido_${pedidoCounter++}`,
      cliente_id: data.cliente_id,
      farmacia_id: data.farmacia_id,
      estado: 'pendiente',
      total,
      direccion_entrega: data.direccion_entrega || null,
      notas: data.notas || null,
      items: data.items.map((item, index) => ({
        id: `item_${Date.now()}_${index}`,
        ...item,
        subtotal: item.cantidad * item.precio_unitario,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    pedidosDB.push(nuevoPedido)

    // TODO: Enviar notificación a la farmacia
    // TODO: Enviar email de confirmación al cliente

    return NextResponse.json({
      success: true,
      pedido: nuevoPedido,
      message: 'Pedido creado correctamente',
    })
  } catch (error) {
    console.error('Error al crear pedido:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear el pedido' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('cliente_id')
    const farmaciaId = searchParams.get('farmacia_id')

    let pedidos = [...pedidosDB]

    if (clienteId) {
      pedidos = pedidos.filter((p) => p.cliente_id === clienteId)
    }

    if (farmaciaId) {
      pedidos = pedidos.filter((p) => p.farmacia_id === farmaciaId)
    }

    // Ordenar por fecha descendente
    pedidos.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return NextResponse.json({
      success: true,
      pedidos,
      total: pedidos.length,
    })
  } catch (error) {
    console.error('Error al obtener pedidos:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener pedidos' },
      { status: 500 }
    )
  }
}

