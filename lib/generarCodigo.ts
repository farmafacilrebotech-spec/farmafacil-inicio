import { verificarCodigoDisponible } from './supabase-helpers'

/**
 * Genera un código único para una farmacia basado en su nombre
 * Formato: PREFIJO + SUFIJO ALEATORIO (ej: FARM7X2)
 */
export function generarCodigoFarmacia(nombre: string): string {
  // Tomar primeras letras del nombre (solo letras)
  const prefijo = nombre
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 4)
    .toUpperCase()
    .padEnd(4, 'X') // Rellenar con X si es muy corto

  // Añadir caracteres alfanuméricos aleatorios
  const sufijo = Math.random()
    .toString(36)
    .substring(2, 5)
    .toUpperCase()

  return `${prefijo}${sufijo}`
}

/**
 * Genera un código único verificando que no exista en la base de datos
 */
export async function generarCodigoUnico(nombre: string): Promise<string> {
  const maxIntentos = 10
  let intentos = 0

  while (intentos < maxIntentos) {
    const codigo = generarCodigoFarmacia(nombre)
    const disponible = await verificarCodigoDisponible(codigo)

    if (disponible) {
      return codigo
    }

    intentos++
  }

  // Fallback con timestamp si todos los intentos fallan
  const timestamp = Date.now().toString(36).toUpperCase()
  return `F${timestamp}`.substring(0, 10)
}

/**
 * Valida el formato de un código de farmacia
 */
export function validarCodigoFarmacia(codigo: string): boolean {
  // Debe ser alfanumérico, mayúsculas, entre 6 y 10 caracteres
  const regex = /^[A-Z0-9]{6,10}$/
  return regex.test(codigo)
}

/**
 * Normaliza un código (mayúsculas, sin espacios)
 */
export function normalizarCodigo(codigo: string): string {
  return codigo.toUpperCase().replace(/\s+/g, '')
}

