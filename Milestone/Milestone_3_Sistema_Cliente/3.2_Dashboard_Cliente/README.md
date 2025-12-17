# 📊 Milestone 3.2: Dashboard del Cliente

## 📑 Índice de Pasos

1. [Paso 1: Estructura del dashboard](#paso-1-estructura-del-dashboard)
2. [Paso 2: Estadísticas del cliente](#paso-2-estadísticas-del-cliente)
3. [Paso 3: Lista de pedidos](#paso-3-lista-de-pedidos)
4. [Paso 4: Acciones rápidas](#paso-4-acciones-rápidas)
5. [Paso 5: Funcionalidad Repetir Pedido](#paso-5-funcionalidad-repetir-pedido)

---

## Paso 1: Estructura del dashboard

### Descripción
Diseño de la estructura principal del dashboard del cliente.

### Archivo: `app/cliente/dashboard/page.tsx`
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { sessionManager } from '@/lib/sessionManager'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ShoppingBag, 
  Package, 
  Euro, 
  Calendar,
  RefreshCw,
  Eye,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [stats, setStats] = useState({
    totalPedidos: 0,
    totalGastado: 0,
    ultimoPedido: null
  })
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    const currentSession = sessionManager.getSession()
    if (!currentSession || currentSession.tipo !== 'cliente') {
      router.push('/login-cliente')
      return
    }
    setSession(currentSession)
    fetchData(currentSession.id)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Hola, {session?.nombre}!
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenido a tu panel de control
          </p>
        </div>

        {/* Stats */}
        <StatsCards stats={stats} loading={loading} />

        {/* Pedidos recientes */}
        <RecentOrders pedidos={pedidos} loading={loading} />

        {/* Acciones rápidas */}
        <QuickActions />
      </div>
    </div>
  )
}
```

### Layout
```
┌────────────────────────────────────────────┐
│  Header (Bienvenida)                       │
├────────────┬────────────┬─────────────────┤
│   Stats    │   Stats    │     Stats       │
│  (Pedidos) │  (Gastado) │  (Últ. pedido)  │
├────────────┴────────────┴─────────────────┤
│                                            │
│           Pedidos Recientes                │
│   ┌────────────────────────────────┐       │
│   │  Pedido 1  │ Estado │ Acciones │       │
│   ├────────────────────────────────┤       │
│   │  Pedido 2  │ Estado │ Acciones │       │
│   └────────────────────────────────┘       │
│                                            │
├────────────────────────────────────────────┤
│           Acciones Rápidas                 │
└────────────────────────────────────────────┘
```

### Resultado
✅ Estructura del dashboard definida

---

## Paso 2: Estadísticas del cliente

### Descripción
Tarjetas con estadísticas personalizadas del cliente.

### Implementación
```typescript
async function fetchStats(clienteId: string) {
  // Total de pedidos
  const { count: totalPedidos } = await supabase
    .from('pedidos')
    .select('*', { count: 'exact', head: true })
    .eq('cliente_id', clienteId)

  // Total gastado
  const { data: pedidosData } = await supabase
    .from('pedidos')
    .select('total')
    .eq('cliente_id', clienteId)
    .eq('estado', 'completado')

  const totalGastado = pedidosData?.reduce((sum, p) => sum + p.total, 0) || 0

  // Último pedido
  const { data: ultimoPedido } = await supabase
    .from('pedidos')
    .select('fecha')
    .eq('cliente_id', clienteId)
    .order('fecha', { ascending: false })
    .limit(1)
    .single()

  return {
    totalPedidos: totalPedidos || 0,
    totalGastado,
    ultimoPedido: ultimoPedido?.fecha || null
  }
}

function StatsCards({ stats, loading }: { stats: any; loading: boolean }) {
  const cards = [
    {
      title: 'Total Pedidos',
      value: stats.totalPedidos,
      icon: ShoppingBag,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      title: 'Total Gastado',
      value: `${stats.totalGastado.toFixed(2)}€`,
      icon: Euro,
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    {
      title: 'Último Pedido',
      value: stats.ultimoPedido 
        ? new Date(stats.ultimoPedido).toLocaleDateString('es-ES')
        : 'Sin pedidos',
      icon: Calendar,
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    }
  ]

  return (
    <div className="grid sm:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${card.bg}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

### Resultado
✅ Estadísticas del cliente visibles

---

## Paso 3: Lista de pedidos

### Descripción
Tabla de pedidos recientes con información detallada.

### Implementación
```typescript
async function fetchPedidos(clienteId: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      farmacias (
        id,
        nombre
      )
    `)
    .eq('cliente_id', clienteId)
    .order('fecha', { ascending: false })
    .limit(10)

  if (error) throw error
  return data
}

function RecentOrders({ pedidos, loading }: { pedidos: any[]; loading: boolean }) {
  const getStatusBadge = (estado: string) => {
    const statusConfig = {
      pendiente: { variant: 'warning', label: 'Pendiente' },
      en_preparacion: { variant: 'info', label: 'En preparación' },
      enviado: { variant: 'info', label: 'Enviado' },
      completado: { variant: 'success', label: 'Completado' },
      cancelado: { variant: 'destructive', label: 'Cancelado' }
    }
    const config = statusConfig[estado] || statusConfig.pendiente
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pedidos Recientes</CardTitle>
        <Link href="/cliente/pedidos">
          <Button variant="ghost" size="sm">
            Ver todos
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {pedidos.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Aún no tienes pedidos</p>
            <Button asChild className="mt-4 bg-[#1ABBB3]">
              <Link href="/catalogo">Explorar catálogo</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {pedidos.map((pedido) => (
              <div 
                key={pedido.id} 
                className="py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Package className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Pedido #{pedido.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {pedido.farmacias?.nombre} · {' '}
                      {new Date(pedido.fecha).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {getStatusBadge(pedido.estado)}
                  <span className="font-semibold">
                    {pedido.total.toFixed(2)}€
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/pedidos/${pedido.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRepeatOrder(pedido.id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

### Resultado
✅ Lista de pedidos con acciones

---

## Paso 4: Acciones rápidas

### Descripción
Sección de acciones rápidas para el cliente.

### Implementación
```typescript
function QuickActions() {
  const actions = [
    {
      title: 'Ver Catálogo',
      description: 'Explora todos los productos disponibles',
      icon: ShoppingBag,
      href: '/catalogo',
      color: 'bg-[#1ABBB3]'
    },
    {
      title: 'Mi Carrito',
      description: 'Revisa los productos en tu carrito',
      icon: Package,
      onClick: () => window.dispatchEvent(new CustomEvent('openCart')),
      color: 'bg-blue-500'
    },
    {
      title: 'Hablar con Asistente',
      description: 'Resuelve tus dudas con nuestro asistente IA',
      icon: MessageCircle,
      onClick: () => window.dispatchEvent(new CustomEvent('openAssistant')),
      color: 'bg-purple-500'
    },
    {
      title: 'Mis Datos',
      description: 'Actualiza tu información personal',
      href: '/cliente/perfil',
      icon: User,
      color: 'bg-gray-500'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <ActionCard key={index} action={action} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ActionCard({ action }: { action: any }) {
  const content = (
    <div className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer group">
      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
        <action.icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="font-medium text-gray-900 group-hover:text-[#1ABBB3] transition-colors">
        {action.title}
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        {action.description}
      </p>
    </div>
  )

  if (action.href) {
    return <Link href={action.href}>{content}</Link>
  }

  return <div onClick={action.onClick}>{content}</div>
}
```

### Resultado
✅ Acciones rápidas implementadas

---

## Paso 5: Funcionalidad Repetir Pedido

### Descripción
Funcionalidad para repetir un pedido anterior añadiendo los productos al carrito.

### Implementación
```typescript
const handleRepeatOrder = async (pedidoId: string) => {
  setRepeating(true)

  try {
    // Obtener detalles del pedido
    const { data: detalles, error } = await supabase
      .from('detalles_pedido')
      .select(`
        cantidad,
        productos (
          id,
          nombre,
          precio,
          stock,
          imagen_url,
          farmacia_id,
          farmacias (
            nombre
          )
        )
      `)
      .eq('pedido_id', pedidoId)

    if (error) throw error

    // Verificar disponibilidad y añadir al carrito
    const itemsAdded = []
    const itemsUnavailable = []

    for (const detalle of detalles) {
      const producto = detalle.productos

      if (producto.stock >= detalle.cantidad) {
        // Añadir al carrito
        addToCart({
          producto_id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: detalle.cantidad,
          imagen_url: producto.imagen_url,
          farmacia_id: producto.farmacia_id,
          farmacia_nombre: producto.farmacias.nombre,
          stock: producto.stock
        })
        itemsAdded.push(producto.nombre)
      } else if (producto.stock > 0) {
        // Añadir stock disponible
        addToCart({
          ...producto,
          cantidad: producto.stock
        })
        itemsAdded.push(`${producto.nombre} (solo ${producto.stock} disponibles)`)
      } else {
        itemsUnavailable.push(producto.nombre)
      }
    }

    // Feedback
    if (itemsAdded.length > 0) {
      toast.success(`${itemsAdded.length} producto(s) añadidos al carrito`)
    }
    if (itemsUnavailable.length > 0) {
      toast.warning(`Productos no disponibles: ${itemsUnavailable.join(', ')}`)
    }

    // Abrir carrito
    window.dispatchEvent(new CustomEvent('openCart'))

  } catch (error) {
    toast.error('Error al repetir el pedido')
  } finally {
    setRepeating(false)
  }
}
```

### Flujo de repetir pedido
```
┌─────────────────┐
│ Clic "Repetir"  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Obtener         │
│ detalles pedido │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Por cada        │
│ producto:       │
│ ┌─────────────┐ │
│ │ ¿Stock > 0? │ │
│ └──────┬──────┘ │
└────────┼────────┘
    Sí   │   No
    ▼    │    ▼
┌───────┐│┌──────┐
│Añadir ││ │Avisar│
│carrito││ │no hay│
└───────┘│└──────┘
         │
         ▼
┌─────────────────┐
│ Abrir carrito   │
└─────────────────┘
```

### Resultado
✅ Repetir pedido funcional con validación de stock

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `app/cliente/dashboard/page.tsx` | Dashboard del cliente |
| `lib/cart.ts` | Funciones del carrito |
| `lib/sessionManager.ts` | Gestión de sesión |

---

## ✅ Checklist de Completado

- [x] Estructura del dashboard definida
- [x] Estadísticas del cliente implementadas
- [x] Lista de pedidos con estados
- [x] Acciones rápidas disponibles
- [x] Funcionalidad Repetir Pedido operativa

---

[← Anterior: 3.1 Login](../3.1_Login_Registro_Cliente/README.md) | [Siguiente: 3.3 Carrito →](../3.3_Sistema_Carrito/README.md)

