import { jsPDF } from 'jspdf'

export interface ReciboData {
  // Información del pedido
  pedidoId: string
  fecha: Date
  
  // Cliente
  clienteNombre: string
  clienteTelefono: string
  clienteDireccion?: string
  
  // Farmacia
  farmaciaNombre: string
  farmaciaTelefono?: string
  farmaciaDireccion?: string
  
  // Productos
  productos: Array<{
    nombre: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }>
  
  // Totales
  subtotal: number
  envio: number
  total: number
  
  // Método de pago
  metodoPago: string
}

/**
 * Genera un PDF con el recibo del pedido
 * @returns Base64 del PDF generado
 */
export function generarReciboPDF(data: ReciboData): string {
  const doc = new jsPDF()
  
  const primaryColor: [number, number, number] = [26, 187, 179] // #1ABBB3
  const darkColor: [number, number, number] = [26, 26, 26] // #1A1A1A
  const grayColor: [number, number, number] = [128, 128, 128]
  
  let y = 20
  
  // === HEADER ===
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, 'F')
  
  // Logo/Título
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('FarmaFácil', 20, 25)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Recibo de Pedido', 20, 33)
  
  // Número de pedido
  doc.setFontSize(12)
  doc.text(`Pedido #${data.pedidoId}`, 150, 25)
  doc.setFontSize(10)
  doc.text(formatDate(data.fecha), 150, 33)
  
  y = 55
  
  // === INFORMACIÓN DE LA FARMACIA ===
  doc.setTextColor(...darkColor)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Farmacia', 20, y)
  
  y += 7
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(data.farmaciaNombre, 20, y)
  
  if (data.farmaciaDireccion) {
    y += 5
    doc.setTextColor(...grayColor)
    doc.text(data.farmaciaDireccion, 20, y)
  }
  
  if (data.farmaciaTelefono) {
    y += 5
    doc.text(`Tel: ${data.farmaciaTelefono}`, 20, y)
  }
  
  // === INFORMACIÓN DEL CLIENTE ===
  let yCliente = 55
  doc.setTextColor(...darkColor)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Cliente', 120, yCliente)
  
  yCliente += 7
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(data.clienteNombre, 120, yCliente)
  
  yCliente += 5
  doc.setTextColor(...grayColor)
  doc.text(`Tel: ${data.clienteTelefono}`, 120, yCliente)
  
  if (data.clienteDireccion) {
    yCliente += 5
    doc.text(data.clienteDireccion, 120, yCliente)
  }
  
  y = Math.max(y, yCliente) + 15
  
  // === LÍNEA SEPARADORA ===
  doc.setDrawColor(...primaryColor)
  doc.setLineWidth(0.5)
  doc.line(20, y, 190, y)
  
  y += 10
  
  // === TABLA DE PRODUCTOS ===
  // Header de la tabla
  doc.setFillColor(245, 245, 245)
  doc.rect(20, y - 5, 170, 10, 'F')
  
  doc.setTextColor(...darkColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Producto', 25, y)
  doc.text('Cant.', 110, y)
  doc.text('Precio', 130, y)
  doc.text('Subtotal', 160, y)
  
  y += 10
  
  // Productos
  doc.setFont('helvetica', 'normal')
  for (const producto of data.productos) {
    // Truncar nombre si es muy largo
    const nombreTruncado = producto.nombre.length > 40 
      ? producto.nombre.substring(0, 37) + '...' 
      : producto.nombre
    
    doc.text(nombreTruncado, 25, y)
    doc.text(producto.cantidad.toString(), 115, y)
    doc.text(`${producto.precioUnitario.toFixed(2)}€`, 130, y)
    doc.text(`${producto.subtotal.toFixed(2)}€`, 160, y)
    
    y += 7
    
    // Nueva página si es necesario
    if (y > 250) {
      doc.addPage()
      y = 20
    }
  }
  
  y += 5
  
  // === LÍNEA SEPARADORA ===
  doc.setDrawColor(200, 200, 200)
  doc.line(20, y, 190, y)
  
  y += 10
  
  // === TOTALES ===
  doc.setTextColor(...grayColor)
  doc.text('Subtotal:', 130, y)
  doc.setTextColor(...darkColor)
  doc.text(`${data.subtotal.toFixed(2)}€`, 165, y)
  
  y += 7
  doc.setTextColor(...grayColor)
  doc.text('Envío:', 130, y)
  doc.setTextColor(34, 197, 94) // green
  doc.text(data.envio === 0 ? 'GRATIS' : `${data.envio.toFixed(2)}€`, 165, y)
  
  y += 10
  doc.setDrawColor(...primaryColor)
  doc.line(125, y - 3, 190, y - 3)
  
  doc.setTextColor(...darkColor)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', 130, y + 5)
  doc.setTextColor(...primaryColor)
  doc.text(`${data.total.toFixed(2)}€`, 160, y + 5)
  
  y += 20
  
  // === MÉTODO DE PAGO ===
  doc.setFillColor(240, 253, 252)
  doc.roundedRect(20, y, 170, 25, 3, 3, 'F')
  
  doc.setTextColor(...darkColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Método de pago:', 25, y + 10)
  doc.setFont('helvetica', 'normal')
  doc.text(data.metodoPago, 25, y + 18)
  
  y += 35
  
  // === FOOTER ===
  doc.setFontSize(8)
  doc.setTextColor(...grayColor)
  doc.text('Gracias por tu compra en FarmaFácil', 105, y, { align: 'center' })
  doc.text('Este documento sirve como comprobante de tu pedido', 105, y + 5, { align: 'center' })
  doc.text(`Generado el ${formatDateTime(new Date())}`, 105, y + 10, { align: 'center' })
  
  // Generar Base64
  return doc.output('datauristring')
}

/**
 * Genera el PDF y retorna como Blob para descarga
 */
export function generarReciboPDFBlob(data: ReciboData): Blob {
  const doc = generarReciboPDFDoc(data)
  return doc.output('blob')
}

/**
 * Genera el documento PDF (para uso interno)
 */
function generarReciboPDFDoc(data: ReciboData): jsPDF {
  const doc = new jsPDF()
  
  const primaryColor: [number, number, number] = [26, 187, 179]
  const darkColor: [number, number, number] = [26, 26, 26]
  const grayColor: [number, number, number] = [128, 128, 128]
  
  let y = 20
  
  // Header
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('FarmaFácil', 20, 25)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Recibo de Pedido', 20, 33)
  
  doc.setFontSize(12)
  doc.text(`Pedido #${data.pedidoId}`, 150, 25)
  doc.setFontSize(10)
  doc.text(formatDate(data.fecha), 150, 33)
  
  y = 55
  
  // Info Farmacia
  doc.setTextColor(...darkColor)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Farmacia', 20, y)
  
  y += 7
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(data.farmaciaNombre, 20, y)
  
  if (data.farmaciaDireccion) {
    y += 5
    doc.setTextColor(...grayColor)
    doc.text(data.farmaciaDireccion, 20, y)
  }
  
  // Info Cliente
  let yCliente = 55
  doc.setTextColor(...darkColor)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Cliente', 120, yCliente)
  
  yCliente += 7
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(data.clienteNombre, 120, yCliente)
  
  yCliente += 5
  doc.setTextColor(...grayColor)
  doc.text(`Tel: ${data.clienteTelefono}`, 120, yCliente)
  
  y = Math.max(y, yCliente) + 15
  
  // Separador
  doc.setDrawColor(...primaryColor)
  doc.setLineWidth(0.5)
  doc.line(20, y, 190, y)
  
  y += 10
  
  // Tabla productos
  doc.setFillColor(245, 245, 245)
  doc.rect(20, y - 5, 170, 10, 'F')
  
  doc.setTextColor(...darkColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Producto', 25, y)
  doc.text('Cant.', 110, y)
  doc.text('Precio', 130, y)
  doc.text('Subtotal', 160, y)
  
  y += 10
  
  doc.setFont('helvetica', 'normal')
  for (const producto of data.productos) {
    const nombreTruncado = producto.nombre.length > 40 
      ? producto.nombre.substring(0, 37) + '...' 
      : producto.nombre
    
    doc.text(nombreTruncado, 25, y)
    doc.text(producto.cantidad.toString(), 115, y)
    doc.text(`${producto.precioUnitario.toFixed(2)}€`, 130, y)
    doc.text(`${producto.subtotal.toFixed(2)}€`, 160, y)
    
    y += 7
  }
  
  y += 5
  doc.setDrawColor(200, 200, 200)
  doc.line(20, y, 190, y)
  
  y += 10
  
  // Totales
  doc.setTextColor(...grayColor)
  doc.text('Subtotal:', 130, y)
  doc.setTextColor(...darkColor)
  doc.text(`${data.subtotal.toFixed(2)}€`, 165, y)
  
  y += 7
  doc.setTextColor(...grayColor)
  doc.text('Envío:', 130, y)
  doc.setTextColor(34, 197, 94)
  doc.text(data.envio === 0 ? 'GRATIS' : `${data.envio.toFixed(2)}€`, 165, y)
  
  y += 10
  doc.setDrawColor(...primaryColor)
  doc.line(125, y - 3, 190, y - 3)
  
  doc.setTextColor(...darkColor)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', 130, y + 5)
  doc.setTextColor(...primaryColor)
  doc.text(`${data.total.toFixed(2)}€`, 160, y + 5)
  
  y += 20
  
  // Método de pago
  doc.setFillColor(240, 253, 252)
  doc.roundedRect(20, y, 170, 25, 3, 3, 'F')
  
  doc.setTextColor(...darkColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Método de pago:', 25, y + 10)
  doc.setFont('helvetica', 'normal')
  doc.text(data.metodoPago, 25, y + 18)
  
  y += 35
  
  // Footer
  doc.setFontSize(8)
  doc.setTextColor(...grayColor)
  doc.text('Gracias por tu compra en FarmaFácil', 105, y, { align: 'center' })
  doc.text('Este documento sirve como comprobante de tu pedido', 105, y + 5, { align: 'center' })
  
  return doc
}

// Helpers
function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Genera un ID único para el pedido
 */
export function generarPedidoId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `FF-${timestamp}-${random}`
}

