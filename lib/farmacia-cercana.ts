import { haversineDistance } from './distance'
import { Farmacia, getFarmacias } from './supabase-helpers'

export interface FarmaciaConDistancia extends Farmacia {
  distancia: number // en km
}

/**
 * Encuentra la farmacia más cercana a una ubicación
 */
export function findNearestFarmacia(
  userLat: number,
  userLng: number,
  farmacias: Farmacia[]
): FarmaciaConDistancia | null {
  let nearest: FarmaciaConDistancia | null = null
  let minDistance = Infinity

  for (const farmacia of farmacias) {
    // Saltar farmacias sin coordenadas
    if (!farmacia.latitud || !farmacia.longitud) continue

    const distance = haversineDistance(
      userLat,
      userLng,
      farmacia.latitud,
      farmacia.longitud
    )

    if (distance < minDistance) {
      minDistance = distance
      nearest = {
        ...farmacia,
        distancia: Math.round(distance * 100) / 100, // 2 decimales
      }
    }
  }

  return nearest
}

/**
 * Ordena farmacias por distancia a una ubicación
 */
export function sortFarmaciasByDistance(
  userLat: number,
  userLng: number,
  farmacias: Farmacia[]
): FarmaciaConDistancia[] {
  return farmacias
    .filter((f) => f.latitud && f.longitud)
    .map((farmacia) => ({
      ...farmacia,
      distancia:
        Math.round(
          haversineDistance(
            userLat,
            userLng,
            farmacia.latitud!,
            farmacia.longitud!
          ) * 100
        ) / 100,
    }))
    .sort((a, b) => a.distancia - b.distancia)
}

/**
 * Busca farmacias dentro de un radio
 */
export function findFarmaciasInRadius(
  userLat: number,
  userLng: number,
  farmacias: Farmacia[],
  radiusKm: number = 10
): FarmaciaConDistancia[] {
  return sortFarmaciasByDistance(userLat, userLng, farmacias).filter(
    (f) => f.distancia <= radiusKm
  )
}

/**
 * Obtiene la farmacia más cercana desde la base de datos
 */
export async function getNearestFarmaciaFromDB(
  userLat: number,
  userLng: number
): Promise<FarmaciaConDistancia | null> {
  const farmacias = await getFarmacias()
  return findNearestFarmacia(userLat, userLng, farmacias)
}

/**
 * Obtiene farmacias cercanas dentro de un radio desde la base de datos
 */
export async function getNearbyFarmaciasFromDB(
  userLat: number,
  userLng: number,
  radiusKm: number = 10
): Promise<FarmaciaConDistancia[]> {
  const farmacias = await getFarmacias()
  return findFarmaciasInRadius(userLat, userLng, farmacias, radiusKm)
}

