/**
 * URL Builder para aplicaciones FarmaFácil
 * 
 * Centraliza la construcción de URLs hacia las aplicaciones externas:
 * - farmafacil_clientes (catálogo web para clientes)
 * - farmafacil_kiosko (aplicación kiosko para farmacias)
 */

/**
 * URL del catálogo de clientes
 * @param codigo - Código único de la farmacia
 * @returns URL completa al catálogo de cliente de la farmacia
 */
export function clienteUrl(codigo: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENTES_URL || 'https://farmafacil-clientes.vercel.app';
  return `${baseUrl}/farmacia/${codigo}`;
}

/**
 * URL del kiosko
 * @param codigo - Código único de la farmacia
 * @returns URL completa al kiosko de la farmacia
 */
export function kioskoUrl(codigo: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_KIOSKO_URL || 'https://farmafacil-kiosko.vercel.app';
  return `${baseUrl}/farmacia/${codigo}?kiosk=1`;
}

