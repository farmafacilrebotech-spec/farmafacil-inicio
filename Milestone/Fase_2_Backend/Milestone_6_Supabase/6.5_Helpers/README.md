# 🛠️ 6.5 Helpers y Utilidades

## 📋 Funciones Auxiliares para Supabase

### Archivo Principal: `lib/supabase-helpers.ts`

```typescript
import { supabase } from './supabase'

// ============================================
// FARMACIAS
// ============================================

export async function getFarmacias() {
  const { data, error } = await supabase
    .from('farmacias')
    .select('*')
    .eq('activa', true)
    .order('nombre')
  
  if (error) throw error
  return data
}

export async function getFarmaciaByCodigo(codigo: string) {
  const { data, error } = await supabase
    .from('farmacias')
    .select('*')
    .eq('codigo', codigo)
    .eq('activa', true)
    .single()
  
  if (error) throw error
  return data
}

export async function getFarmaciaById(id: string) {
  const { data, error } = await supabase
    .from('farmacias')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// ============================================
// PRODUCTOS
// ============================================

export async function getProductosByFarmacia(farmaciaId: string) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('farmacia_id', farmaciaId)
    .eq('activo', true)
    .order('nombre')
  
  if (error) throw error
  return data
}

export async function getProductosByCodigo(codigoFarmacia: string) {
  // Primero obtener farmacia por código
  const farmacia = await getFarmaciaByCodigo(codigoFarmacia)
  if (!farmacia) return []
  
  return getProductosByFarmacia(farmacia.id)
}

export async function searchProductos(query: string, farmaciaId?: string) {
  let queryBuilder = supabase
    .from('productos')
    .select('*, farmacias(nombre, codigo)')
    .eq('activo', true)
    .ilike('nombre', `%${query}%`)
  
  if (farmaciaId) {
    queryBuilder = queryBuilder.eq('farmacia_id', farmaciaId)
  }
  
  const { data, error } = await queryBuilder.limit(20)
  
  if (error) throw error
  return data
}

// ============================================
// PEDIDOS
// ============================================

export async function createPedido(pedido: {
  cliente_id: string
  farmacia_id: string
  items: Array<{
    producto_id: string
    cantidad: number
    precio_unitario: number
  }>
  direccion_entrega?: string
  notas?: string
}) {
  // Calcular total
  const total = pedido.items.reduce(
    (sum, item) => sum + (item.cantidad * item.precio_unitario),
    0
  )
  
  // Insertar pedido
  const { data: newPedido, error: pedidoError } = await supabase
    .from('pedidos')
    .insert({
      cliente_id: pedido.cliente_id,
      farmacia_id: pedido.farmacia_id,
      total,
      direccion_entrega: pedido.direccion_entrega,
      notas: pedido.notas,
    })
    .select()
    .single()
  
  if (pedidoError) throw pedidoError
  
  // Insertar items
  const items = pedido.items.map(item => ({
    pedido_id: newPedido.id,
    producto_id: item.producto_id,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
    subtotal: item.cantidad * item.precio_unitario,
  }))
  
  const { error: itemsError } = await supabase
    .from('pedido_items')
    .insert(items)
  
  if (itemsError) throw itemsError
  
  return newPedido
}

export async function getPedidosByCliente(clienteId: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      farmacias(nombre, codigo),
      pedido_items(
        cantidad,
        precio_unitario,
        subtotal,
        productos(nombre, imagen_url)
      )
    `)
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getPedidosByFarmacia(farmaciaId: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      clientes(nombre, email, telefono),
      pedido_items(
        cantidad,
        precio_unitario,
        subtotal,
        productos(nombre)
      )
    `)
    .eq('farmacia_id', farmaciaId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function updatePedidoEstado(
  pedidoId: string, 
  estado: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado'
) {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ estado })
    .eq('id', pedidoId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================
// GEOLOCALIZACIÓN
// ============================================

export async function getFarmaciaCercana(lat: number, lng: number) {
  // Usar función de Supabase con PostGIS o cálculo manual
  const { data, error } = await supabase
    .rpc('get_farmacia_cercana', { 
      user_lat: lat, 
      user_lng: lng 
    })
  
  if (error) {
    // Fallback: obtener todas y calcular en cliente
    const farmacias = await getFarmacias()
    return findClosest(farmacias, lat, lng)
  }
  
  return data
}

// Helper para calcular distancia (Haversine)
function findClosest(
  farmacias: any[], 
  lat: number, 
  lng: number
) {
  let closest = null
  let minDistance = Infinity
  
  for (const farmacia of farmacias) {
    if (!farmacia.latitud || !farmacia.longitud) continue
    
    const distance = haversine(
      lat, lng,
      farmacia.latitud, farmacia.longitud
    )
    
    if (distance < minDistance) {
      minDistance = distance
      closest = { ...farmacia, distance }
    }
  }
  
  return closest
}

function haversine(
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
  
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
```

---

## 📊 Uso de los Helpers

### En Componentes

```typescript
'use client'

import { useState, useEffect } from 'react'
import { getFarmacias, getProductosByCodigo } from '@/lib/supabase-helpers'

export default function CatalogoFarmacia({ codigo }: { codigo: string }) {
  const [productos, setProductos] = useState([])
  
  useEffect(() => {
    async function load() {
      const data = await getProductosByCodigo(codigo)
      setProductos(data)
    }
    load()
  }, [codigo])
  
  return (/* render productos */)
}
```

### En API Routes

```typescript
// app/api/farmacias/route.ts
import { NextResponse } from 'next/server'
import { getFarmacias } from '@/lib/supabase-helpers'

export async function GET() {
  try {
    const farmacias = await getFarmacias()
    return NextResponse.json({ success: true, farmacias })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener farmacias' },
      { status: 500 }
    )
  }
}
```

---

## ✅ Checklist

- [x] Helpers de farmacias
- [x] Helpers de productos
- [x] Helpers de pedidos
- [x] Helper de geolocalización
- [x] Función Haversine implementada
- [x] Documentación de uso

---

*Paso 5 de Milestone 6 - Configuración Supabase*

