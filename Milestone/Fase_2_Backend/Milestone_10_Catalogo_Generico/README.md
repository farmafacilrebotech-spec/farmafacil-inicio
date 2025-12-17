# 🛒 Milestone 10: Catálogo Genérico y Carrito Inteligente

## 📋 Índice de Sub-Milestones

| Sub-Milestone | Descripción | Estado |
|---------------|-------------|--------|
| [10.1 Catálogo Público](./10.1_Catalogo_Publico/) | Catálogo sin farmacia específica | 🟢 Completado |
| [10.2 Geolocalización](./10.2_Geolocalizacion/) | Obtener ubicación del cliente | 🟡 Preparado |
| [10.3 Farmacia Cercana](./10.3_Farmacia_Cercana/) | Algoritmo de búsqueda por proximidad | 🟡 Preparado |
| [10.4 Carrito Inteligente](./10.4_Carrito/) | Asignación automática de farmacia | 🟡 Preparado |
| [10.5 Pedido a Farmacia](./10.5_Pedido/) | Crear pedido con farmacia asignada | 🔴 Pendiente |

---

## 🎯 Objetivo del Milestone

Implementar un **catálogo genérico** accesible desde la landing page que:
- Muestra productos de todas las farmacias
- Al crear un carrito, asigna automáticamente la **farmacia más cercana**
- El asistente virtual solo aparece en el catálogo (no en landing)

---

## 🔄 Flujo del Catálogo Genérico

```
┌─────────────────────────────────────────────────────────────┐
│              FLUJO CATÁLOGO GENÉRICO                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. ACCESO AL CATÁLOGO                                      │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Usuario en landing page                        │    │
│     │  → Click en "Ver Catálogo"                      │    │
│     │  → Navega a /catalogo                           │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  2. CATÁLOGO GENÉRICO                                       │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Muestra productos de TODAS las farmacias       │    │
│     │  - Búsqueda por nombre                          │    │
│     │  - Filtro por categoría                         │    │
│     │  - Asistente virtual disponible 🤖              │    │
│     │  - Carrito disponible 🛒                        │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│         Usuario añade productos al carrito                  │
│                           │                                 │
│                           ▼                                 │
│  3. GEOLOCALIZACIÓN (al checkout)                           │
│     ┌─────────────────────────────────────────────────┐    │
│     │  "¿Permites acceso a tu ubicación?"             │    │
│     │  [Permitir] [Denegar]                           │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│           ┌───────────────┴───────────────┐                │
│           ▼                               ▼                │
│   PERMITIR                          DENEGAR                │
│   ┌───────────────────┐          ┌───────────────────┐    │
│   │ navigator.geo...  │          │ Pedir código      │    │
│   │ lat, lng obtenidos│          │ postal manualmente│    │
│   └─────────┬─────────┘          └─────────┬─────────┘    │
│             │                              │               │
│             └──────────────┬───────────────┘               │
│                            ▼                               │
│  4. ASIGNAR FARMACIA CERCANA                               │
│     ┌─────────────────────────────────────────────────┐    │
│     │  getFarmaciaCercana(lat, lng)                   │    │
│     │  → Calcular distancia a cada farmacia           │    │
│     │  → Ordenar por proximidad                       │    │
│     │  → Seleccionar la más cercana                   │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  5. CREAR PEDIDO                                            │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Pedido asignado a: Farmacia San Miguel         │    │
│     │  (a 0.5 km de tu ubicación)                     │    │
│     │                                                 │    │
│     │  [Confirmar pedido] [Elegir otra farmacia]      │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Archivos Relevantes

### Catálogo Genérico Actual

**Archivo**: `app/catalogo/page.tsx`

```tsx
'use client'

import ProductCard from '@/components/ProductCard'
import FloatingAssistantButton from '@/components/assistants/FloatingAssistantButton'
import CartButton from '@/components/cart/CartButton'

export default function CatalogoPage() {
  // Obtiene productos de TODAS las farmacias
  const fetchProductos = async () => {
    const response = await fetch('/api/products/list')
    const data = await response.json()
    return data.productos
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />
      
      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productos.map(producto => (
          <ProductCard key={producto.id} {...producto} />
        ))}
      </div>

      {/* Solo en catálogo - Asistente y Carrito */}
      <FloatingAssistantButton />
      <CartButton />
      
      <Footer />
    </div>
  )
}
```

---

## 📍 Geolocalización

### Hook de Geolocalización

```typescript
// hooks/useGeolocation.ts

import { useState, useEffect } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  })

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocalización no soportada',
        loading: false,
      }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        })
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false,
        }))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache 5 min
      }
    )
  }

  return { ...state, requestLocation }
}
```

---

## 📏 Algoritmo Farmacia Cercana

### Fórmula Haversine

```typescript
// lib/distance.ts

/**
 * Calcula la distancia entre dos puntos geográficos
 * usando la fórmula de Haversine
 */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371 // Radio de la Tierra en km
  
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  
  const a = 
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * 
    Math.cos(toRad(lat2)) * 
    Math.sin(dLng / 2) ** 2
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return R * c // Distancia en km
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Encuentra la farmacia más cercana a una ubicación
 */
export function findNearestFarmacia(
  userLat: number,
  userLng: number,
  farmacias: Array<{ id: string; latitud: number; longitud: number }>
) {
  let nearest = null
  let minDistance = Infinity

  for (const farmacia of farmacias) {
    if (!farmacia.latitud || !farmacia.longitud) continue
    
    const distance = haversineDistance(
      userLat, userLng,
      farmacia.latitud, farmacia.longitud
    )

    if (distance < minDistance) {
      minDistance = distance
      nearest = { ...farmacia, distance }
    }
  }

  return nearest
}
```

---

## 🛒 Carrito Inteligente

### Estado del Carrito

```typescript
// hooks/useCart.ts

interface CartState {
  items: CartItem[]
  farmaciaAsignada: Farmacia | null
  total: number
}

interface CartItem {
  productoId: string
  nombre: string
  precio: number
  cantidad: number
  imagen?: string
}
```

### Flujo de Asignación

```typescript
// Al hacer checkout
async function handleCheckout() {
  // 1. Obtener ubicación
  const { latitude, longitude } = await getLocation()
  
  // 2. Buscar farmacia cercana
  const farmacia = await findNearestFarmacia(latitude, longitude)
  
  // 3. Asignar al carrito
  setFarmaciaAsignada(farmacia)
  
  // 4. Mostrar confirmación
  showConfirmation({
    farmacia,
    distancia: farmacia.distance
  })
}
```

---

## 📊 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    CATÁLOGO GENÉRICO                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    /catalogo                        │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │           ProductGrid                       │   │   │
│  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐               │   │   │
│  │  │  │Prod│ │Prod│ │Prod│ │Prod│               │   │   │
│  │  │  └────┘ └────┘ └────┘ └────┘               │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  FloatingAssistantButton  🤖                 │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  CartButton  🛒                              │   │   │
│  │  │  ├─ items: []                               │   │   │
│  │  │  └─ farmaciaAsignada: null                  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Estado Actual

- ✅ Catálogo genérico implementado
- ✅ Asistente solo en catálogo (quitado de landing)
- ✅ Carrito básico funcional
- 🟡 Geolocalización: preparado, no integrado
- 🟡 Farmacia cercana: algoritmo listo, no conectado
- 🔴 Pedido automático: pendiente

---

## 🚀 Próximos Pasos

1. Integrar hook de geolocalización en checkout
2. Conectar algoritmo de farmacia cercana
3. UI de confirmación de farmacia asignada
4. API de creación de pedido
5. Notificación a farmacia

---

## ✅ Checklist

- [x] Catálogo público en /catalogo
- [x] Productos de todas las farmacias
- [x] Asistente movido a catálogo
- [ ] Hook de geolocalización
- [ ] Algoritmo farmacia cercana
- [ ] Carrito con asignación automática
- [ ] API de pedidos
- [ ] UI de confirmación

---

*Milestone 10 de Fase 2 Backend*

