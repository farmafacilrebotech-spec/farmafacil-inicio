# 📍 10.2 Geolocalización

## 📋 Hook de Geolocalización (Preparado)

### Implementación

```typescript
// hooks/useGeolocation.ts

import { useState, useCallback } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
  permission: 'granted' | 'denied' | 'prompt' | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
    permission: null,
  })

  const requestLocation = useCallback(() => {
    // Verificar soporte
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Tu navegador no soporta geolocalización',
        loading: false,
      }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

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
        let errorMessage = 'Error desconocido'
        let permission: 'denied' | 'prompt' = 'prompt'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Has denegado el acceso a tu ubicación'
            permission = 'denied'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'No se pudo obtener tu ubicación'
            break
          case error.TIMEOUT:
            errorMessage = 'La solicitud de ubicación ha expirado'
            break
        }

        setState(prev => ({
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
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    requestLocation,
    clearError,
    hasLocation: state.latitude !== null && state.longitude !== null,
  }
}
```

---

## 🔄 Flujo de Uso

```
┌─────────────────────────────────────────────────────────────┐
│                FLUJO DE GEOLOCALIZACIÓN                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. COMPONENTE SOLICITA UBICACIÓN                           │
│     ┌─────────────────────────────────────────────────┐    │
│     │  const { requestLocation } = useGeolocation()   │    │
│     │  onClick={() => requestLocation()}              │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  2. NAVEGADOR MUESTRA PROMPT                                │
│     ┌─────────────────────────────────────────────────┐    │
│     │  ┌─────────────────────────────────────────┐   │    │
│     │  │ farmafacil.app quiere conocer tu        │   │    │
│     │  │ ubicación                               │   │    │
│     │  │                                         │   │    │
│     │  │  [Permitir]  [Bloquear]                 │   │    │
│     │  └─────────────────────────────────────────┘   │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│           ┌───────────────┴───────────────┐                │
│           ▼                               ▼                │
│   PERMITIR                          BLOQUEAR               │
│   ┌───────────────────┐          ┌───────────────────┐    │
│   │ latitude: 39.4699 │          │ error: "Has      │    │
│   │ longitude: -0.3763│          │ denegado..."      │    │
│   │ permission: granted│          │ permission: denied│    │
│   └───────────────────┘          └───────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Componente de Solicitud

```tsx
// components/location/LocationPrompt.tsx

import { useGeolocation } from '@/hooks/useGeolocation'
import { MapPin, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LocationPrompt({ onLocationObtained }: { 
  onLocationObtained: (lat: number, lng: number) => void 
}) {
  const { 
    latitude, 
    longitude, 
    loading, 
    error, 
    requestLocation 
  } = useGeolocation()

  useEffect(() => {
    if (latitude && longitude) {
      onLocationObtained(latitude, longitude)
    }
  }, [latitude, longitude, onLocationObtained])

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg text-center">
      <MapPin className="h-12 w-12 text-[#1ABBB3] mx-auto mb-4" />
      
      <h3 className="text-xl font-bold mb-2">
        ¿Dónde te encuentras?
      </h3>
      
      <p className="text-gray-600 mb-6">
        Necesitamos tu ubicación para encontrar 
        la farmacia más cercana
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <Button
        onClick={requestLocation}
        disabled={loading}
        className="w-full bg-[#1ABBB3] hover:bg-[#4ED3C2]"
      >
        {loading ? 'Obteniendo ubicación...' : 'Permitir ubicación'}
      </Button>

      <p className="text-xs text-gray-500 mt-4">
        También puedes introducir tu código postal manualmente
      </p>
    </div>
  )
}
```

---

## 🔐 Permisos y Privacidad

### Consideraciones

1. **Solo pedir cuando sea necesario** (al checkout)
2. **Explicar por qué** antes de pedir permiso
3. **Ofrecer alternativa** (código postal manual)
4. **No almacenar** ubicación permanentemente

---

## ✅ Checklist

- [x] Hook useGeolocation creado
- [x] Manejo de errores
- [x] Manejo de permisos
- [ ] Componente LocationPrompt
- [ ] Integración en checkout
- [ ] Fallback código postal

---

*Paso 2 de Milestone 10 - Catálogo Genérico*

