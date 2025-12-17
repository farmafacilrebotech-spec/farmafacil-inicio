# 📷 7.5 Escaneo y Redirección

## 📋 Flujo Completo del Escaneo

### Paso 1: Cliente escanea el QR

El cliente usa la cámara de su móvil para escanear el código QR. La mayoría de smartphones modernos detectan automáticamente URLs en códigos QR.

```
📱 Cámara del móvil
     │
     ▼
┌─────────────────────┐
│  Detecta QR         │
│  URL encontrada:    │
│  farmafacil.app/    │
│  catalogo/FARM001   │
│                     │
│  [Abrir enlace]     │
└─────────────────────┘
```

---

### Paso 2: Redirección al catálogo

El navegador del móvil abre la URL:

```
https://farmafacil.app/catalogo/FARM001
                              ▲
                              │
                    Código de farmacia
```

---

### Paso 3: Página de catálogo por código

**Archivo**: `app/catalogo/[codigo]/page.tsx`

```tsx
import { getFarmaciaByCodigo, getProductosByCodigo } from '@/lib/supabase-helpers'
import { notFound } from 'next/navigation'
import CatalogoFarmacia from '@/components/catalogo/CatalogoFarmacia'

interface Props {
  params: { codigo: string }
}

export async function generateMetadata({ params }: Props) {
  const farmacia = await getFarmaciaByCodigo(params.codigo)
  
  if (!farmacia) {
    return { title: 'Farmacia no encontrada' }
  }
  
  return {
    title: `Catálogo de ${farmacia.nombre} | FarmaFácil`,
    description: `Explora el catálogo de productos de ${farmacia.nombre}`
  }
}

export default async function CatalogoFarmaciaPage({ params }: Props) {
  const { codigo } = params
  
  // Obtener farmacia por código
  const farmacia = await getFarmaciaByCodigo(codigo)
  
  if (!farmacia) {
    notFound()
  }
  
  // Obtener productos de la farmacia
  const productos = await getProductosByCodigo(codigo)
  
  return (
    <CatalogoFarmacia 
      farmacia={farmacia}
      productos={productos}
    />
  )
}
```

---

### Paso 4: Componente del catálogo

```tsx
// components/catalogo/CatalogoFarmacia.tsx
'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import FloatingAssistantButton from '@/components/assistants/FloatingAssistantButton'
import CartButton from '@/components/cart/CartButton'

interface Props {
  farmacia: {
    id: string
    codigo: string
    nombre: string
    logo_url?: string
  }
  productos: Array<{
    id: string
    nombre: string
    precio: number
    imagen_url?: string
    // ...
  }>
}

export default function CatalogoFarmacia({ farmacia, productos }: Props) {
  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      {/* Header con info de farmacia */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {farmacia.logo_url && (
              <img 
                src={farmacia.logo_url} 
                alt={farmacia.nombre}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">
                {farmacia.nombre}
              </h1>
              <p className="text-gray-600">
                Catálogo de productos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Grid de productos */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductCard
              key={producto.id}
              {...producto}
              farmacia_id={farmacia.id}
            />
          ))}
        </div>
      </main>

      {/* Botones flotantes - SOLO en catálogo */}
      <FloatingAssistantButton />
      <CartButton farmaciaId={farmacia.id} />
    </div>
  )
}
```

---

### Paso 5: Diagrama completo del flujo

```
┌─────────────────────────────────────────────────────────────┐
│                FLUJO COMPLETO DE ESCANEO                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   📱 MÓVIL DEL CLIENTE                                      │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  1. Abre cámara                                     │  │
│   │  2. Apunta al QR                                    │  │
│   │  3. Sistema detecta URL                             │  │
│   │  4. Click en "Abrir"                                │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   🌐 NAVEGADOR                                              │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  GET https://farmafacil.app/catalogo/FARM001        │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   ⚙️ NEXT.JS SERVER                                         │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  1. Extrae codigo = "FARM001"                       │  │
│   │  2. Consulta Supabase: getFarmaciaByCodigo()        │  │
│   │  3. Consulta productos: getProductosByCodigo()      │  │
│   │  4. Renderiza página SSR                            │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   📄 PÁGINA RENDERIZADA                                     │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  ┌─────────────────────────────────────────────┐   │  │
│   │  │ 🏥 Farmacia San Miguel                      │   │  │
│   │  │    Catálogo de productos                    │   │  │
│   │  └─────────────────────────────────────────────┘   │  │
│   │                                                     │  │
│   │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │  │
│   │  │ Prod │ │ Prod │ │ Prod │ │ Prod │              │  │
│   │  │  1   │ │  2   │ │  3   │ │  4   │              │  │
│   │  └──────┘ └──────┘ └──────┘ └──────┘              │  │
│   │                                                     │  │
│   │                              [🤖]  [🛒]            │  │
│   │                              Asist. Carrito        │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [x] Ruta dinámica /catalogo/[codigo]
- [x] Consulta de farmacia por código
- [x] Consulta de productos por farmacia
- [x] Componente de catálogo con farmacia
- [x] Asistente y carrito en catálogo
- [x] SEO con metadata dinámica

---

*Paso 5 de Milestone 7 - Sistema QR Farmacias*

