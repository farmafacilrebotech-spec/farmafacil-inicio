'use client'

import { useEffect } from 'react'
import { MapPin, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useGeolocation } from '@/hooks/useGeolocation'

interface LocationPromptProps {
  onLocationObtained: (lat: number, lng: number) => void
  onCancel?: () => void
}

export function LocationPrompt({
  onLocationObtained,
  onCancel,
}: LocationPromptProps) {
  const {
    latitude,
    longitude,
    loading,
    error,
    permission,
    requestLocation,
    clearError,
  } = useGeolocation()

  const [showPostalCode, setShowPostalCode] = useState(false)
  const [postalCode, setPostalCode] = useState('')
  const [postalCodeError, setPostalCodeError] = useState('')

  // Cuando se obtiene la ubicación, notificar al padre
  useEffect(() => {
    if (latitude && longitude) {
      onLocationObtained(latitude, longitude)
    }
  }, [latitude, longitude, onLocationObtained])

  // Función para geocodificar código postal (simplificado)
  const handlePostalCodeSubmit = async () => {
    if (!postalCode || postalCode.length !== 5) {
      setPostalCodeError('Introduce un código postal válido de 5 dígitos')
      return
    }

    setPostalCodeError('')

    // Aquí se podría usar una API de geocodificación como Google Maps o Nominatim
    // Por ahora, usamos coordenadas aproximadas para códigos postales de España
    // En producción, usar una API real

    // Coordenadas aproximadas del centro de España para demo
    const aproximadas = {
      lat: 40.4168 + (Math.random() - 0.5) * 0.1,
      lng: -3.7038 + (Math.random() - 0.5) * 0.1,
    }

    onLocationObtained(aproximadas.lat, aproximadas.lng)
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="bg-[#4ED3C2] bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-[#1ABBB3]" />
        </div>
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
          ¿Dónde te encuentras?
        </h3>
        <p className="text-gray-600 text-sm">
          Necesitamos tu ubicación para encontrar la farmacia más cercana
        </p>
      </div>

      {/* Error de geolocalización */}
      {error && !showPostalCode && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{error}</p>
            <button
              onClick={() => {
                clearError()
                setShowPostalCode(true)
              }}
              className="text-sm underline mt-1"
            >
              Introducir código postal manualmente
            </button>
          </div>
        </div>
      )}

      {!showPostalCode ? (
        <>
          {/* Botón de geolocalización */}
          <Button
            onClick={requestLocation}
            disabled={loading}
            className="w-full bg-[#1ABBB3] hover:bg-[#4ED3C2] mb-3"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Obteniendo ubicación...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Usar mi ubicación
              </>
            )}
          </Button>

          {/* Opción de código postal */}
          <button
            onClick={() => setShowPostalCode(true)}
            className="w-full text-center text-sm text-gray-500 hover:text-[#1ABBB3]"
          >
            O introducir código postal manualmente
          </button>
        </>
      ) : (
        <>
          {/* Input de código postal */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Código postal
              </label>
              <Input
                type="text"
                placeholder="46001"
                value={postalCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 5)
                  setPostalCode(value)
                }}
                maxLength={5}
              />
              {postalCodeError && (
                <p className="text-red-500 text-xs mt-1">{postalCodeError}</p>
              )}
            </div>

            <Button
              onClick={handlePostalCodeSubmit}
              className="w-full bg-[#1ABBB3] hover:bg-[#4ED3C2]"
            >
              Buscar farmacias cercanas
            </Button>

            <button
              onClick={() => {
                setShowPostalCode(false)
                setPostalCode('')
                setPostalCodeError('')
              }}
              className="w-full text-center text-sm text-gray-500 hover:text-[#1ABBB3]"
            >
              Volver a usar ubicación GPS
            </button>
          </div>
        </>
      )}

      {/* Botón cancelar */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4"
        >
          Cancelar
        </button>
      )}

      {/* Nota de privacidad */}
      <p className="text-xs text-gray-400 text-center mt-4">
        Tu ubicación solo se usa para encontrar la farmacia más cercana y no se
        almacena
      </p>
    </div>
  )
}

