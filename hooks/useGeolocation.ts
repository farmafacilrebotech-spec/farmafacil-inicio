'use client'

import { useState, useCallback } from 'react'

export interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
  permission: 'granted' | 'denied' | 'prompt' | null
}

export interface UseGeolocationReturn extends GeolocationState {
  requestLocation: () => void
  clearError: () => void
  hasLocation: boolean
}

/**
 * Hook para obtener la geolocalización del usuario
 */
export function useGeolocation(): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
    permission: null,
  })

  const requestLocation = useCallback(() => {
    // Verificar soporte del navegador
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Tu navegador no soporta geolocalización',
        loading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      // Éxito
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
          permission: 'granted',
        })
      },
      // Error
      (error) => {
        let errorMessage = 'Error desconocido al obtener ubicación'
        let permission: 'denied' | 'prompt' = 'prompt'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Has denegado el acceso a tu ubicación'
            permission = 'denied'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'No se pudo obtener tu ubicación. Verifica tu GPS.'
            break
          case error.TIMEOUT:
            errorMessage = 'La solicitud de ubicación ha expirado. Inténtalo de nuevo.'
            break
        }

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
          permission,
        }))
      },
      // Opciones
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache 5 minutos
      }
    )
  }, [])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    requestLocation,
    clearError,
    hasLocation: state.latitude !== null && state.longitude !== null,
  }
}

/**
 * Obtiene la ubicación usando una promesa (para uso en funciones async)
 */
export function getLocationAsync(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Permiso de ubicación denegado'))
            break
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Ubicación no disponible'))
            break
          case error.TIMEOUT:
            reject(new Error('Tiempo de espera agotado'))
            break
          default:
            reject(new Error('Error desconocido'))
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  })
}

