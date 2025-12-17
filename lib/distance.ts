/**
 * Utilidades para cálculo de distancias geográficas
 */

/**
 * Convierte grados a radianes
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Calcula la distancia entre dos puntos geográficos
 * usando la fórmula de Haversine
 *
 * @param lat1 Latitud del punto 1
 * @param lng1 Longitud del punto 1
 * @param lat2 Latitud del punto 2
 * @param lng2 Longitud del punto 2
 * @returns Distancia en kilómetros
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Radio de la Tierra en km

  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Formatea una distancia para mostrar al usuario
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    // Mostrar en metros
    const meters = Math.round(distanceKm * 1000)
    return `${meters} m`
  } else if (distanceKm < 10) {
    // Mostrar con un decimal
    return `${distanceKm.toFixed(1)} km`
  } else {
    // Mostrar sin decimales
    return `${Math.round(distanceKm)} km`
  }
}

/**
 * Estima el tiempo de llegada caminando (5 km/h promedio)
 */
export function estimateWalkingTime(distanceKm: number): string {
  const walkingSpeedKmH = 5
  const timeHours = distanceKm / walkingSpeedKmH
  const timeMinutes = Math.round(timeHours * 60)

  if (timeMinutes < 60) {
    return `${timeMinutes} min caminando`
  } else {
    const hours = Math.floor(timeMinutes / 60)
    const mins = timeMinutes % 60
    return mins > 0 ? `${hours}h ${mins}min caminando` : `${hours}h caminando`
  }
}

/**
 * Estima el tiempo de llegada en coche (30 km/h promedio en ciudad)
 */
export function estimateDrivingTime(distanceKm: number): string {
  const drivingSpeedKmH = 30
  const timeHours = distanceKm / drivingSpeedKmH
  const timeMinutes = Math.round(timeHours * 60)

  if (timeMinutes < 60) {
    return `${timeMinutes} min en coche`
  } else {
    const hours = Math.floor(timeMinutes / 60)
    const mins = timeMinutes % 60
    return mins > 0 ? `${hours}h ${mins}min en coche` : `${hours}h en coche`
  }
}

