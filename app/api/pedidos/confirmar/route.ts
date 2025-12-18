import { NextResponse } from 'next/server'
import { generarReciboPDF, generarPedidoId, ReciboData } from '@/lib/recibo-pdf'
import { sendReciboWhatsApp, generarMensajeConfirmacion, generateWhatsAppLink } from '@/lib/whatsapp-service'
import { getFarmaciaById } from '@/lib/supabase-helpers'

export interface ConfirmarPedidoRequest {
  // Datos del cliente
  clienteNombre: string
  clienteTelefono: string
  clienteDireccion?: string
  
  // Farmacia
  farmaciaId: string
  
  // Productos
  productos: Array<{
    producto_id: string
    nombre: string
    cantidad: number
    precio: number
  }>
  
  // Pago
  metodoPago: string
  total: number
}

export async function POST(request: Request) {
  try {
    const body: ConfirmarPedidoRequest = await request.json()
    
    // Validaciones básicas
    if (!body.clienteNombre || !body.clienteTelefono) {
      return NextResponse.json(
        { success: false, error: 'Nombre y teléfono son obligatorios' },
        { status: 400 }
      )
    }
    
    if (!body.farmaciaId || !body.productos?.length) {
      return NextResponse.json(
        { success: false, error: 'Farmacia y productos son obligatorios' },
        { status: 400 }
      )
    }
    
    // Obtener datos de la farmacia
    const farmacia = await getFarmaciaById(body.farmaciaId)
    if (!farmacia) {
      return NextResponse.json(
        { success: false, error: 'Farmacia no encontrada' },
        { status: 404 }
      )
    }
    
    // Generar ID del pedido
    const pedidoId = generarPedidoId()
    
    // Preparar datos del recibo
    const reciboData: ReciboData = {
      pedidoId,
      fecha: new Date(),
      
      clienteNombre: body.clienteNombre,
      clienteTelefono: body.clienteTelefono,
      clienteDireccion: body.clienteDireccion,
      
      farmaciaNombre: farmacia.nombre,
      farmaciaTelefono: farmacia.telefono,
      farmaciaDireccion: farmacia.direccion,
      
      productos: body.productos.map(p => ({
        nombre: p.nombre,
        cantidad: p.cantidad,
        precioUnitario: p.precio,
        subtotal: p.cantidad * p.precio,
      })),
      
      subtotal: body.total,
      envio: 0, // Gratis por ahora
      total: body.total,
      
      metodoPago: body.metodoPago,
    }
    
    // Generar PDF (como base64 data URI)
    const pdfBase64 = generarReciboPDF(reciboData)
    
    // Generar mensaje de confirmación
    const mensajeCliente = generarMensajeConfirmacion({
      nombreCliente: body.clienteNombre,
      pedidoId,
      total: body.total,
      farmaciaNombre: farmacia.nombre,
      productos: body.productos.map(p => ({
        nombre: p.nombre,
        cantidad: p.cantidad,
      })),
    })
    
    // Links de WhatsApp (para desarrollo/demo)
    const whatsappLinkCliente = generateWhatsAppLink(body.clienteTelefono, mensajeCliente)
    
    let whatsappLinkFarmacia = ''
    if (farmacia.telefono) {
      const mensajeFarmacia = `🔔 *Nuevo Pedido #${pedidoId}*\n\nCliente: ${body.clienteNombre}\nTeléfono: ${body.clienteTelefono}\nTotal: ${body.total.toFixed(2)}€\n\nProductos:\n${body.productos.map(p => `• ${p.cantidad}x ${p.nombre}`).join('\n')}`
      whatsappLinkFarmacia = generateWhatsAppLink(farmacia.telefono, mensajeFarmacia)
    }
    
    // En producción, enviar mensajes automáticamente
    // await sendReciboWhatsApp({
    //   telefono: body.clienteTelefono,
    //   nombreDestinatario: body.clienteNombre,
    //   pedidoId,
    //   total: body.total,
    //   farmaciaNombre: farmacia.nombre,
    //   tipo: 'cliente',
    // })
    //
    // if (farmacia.telefono) {
    //   await sendReciboWhatsApp({
    //     telefono: farmacia.telefono,
    //     nombreDestinatario: body.clienteNombre,
    //     pedidoId,
    //     total: body.total,
    //     farmaciaNombre: farmacia.nombre,
    //     tipo: 'farmacia',
    //   })
    // }
    
    return NextResponse.json({
      success: true,
      pedido: {
        id: pedidoId,
        fecha: new Date().toISOString(),
        total: body.total,
        estado: 'confirmado',
      },
      recibo: {
        pdf: pdfBase64, // Base64 del PDF para descarga
        mensaje: mensajeCliente,
      },
      whatsapp: {
        cliente: whatsappLinkCliente,
        farmacia: whatsappLinkFarmacia,
      },
    })
    
  } catch (error: any) {
    console.error('Error al confirmar pedido:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

