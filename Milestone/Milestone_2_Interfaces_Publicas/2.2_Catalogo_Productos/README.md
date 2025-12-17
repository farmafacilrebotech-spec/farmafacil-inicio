# 📦 Milestone 2.2: Catálogo de Productos

## 📑 Índice de Pasos

1. [Paso 1: Estructura del catálogo](#paso-1-estructura-del-catálogo)
2. [Paso 2: Sistema de filtros](#paso-2-sistema-de-filtros)
3. [Paso 3: Carga de productos](#paso-3-carga-de-productos)
4. [Paso 4: Grid de productos](#paso-4-grid-de-productos)
5. [Paso 5: Paginación y estados](#paso-5-paginación-y-estados)

---

## Paso 1: Estructura del catálogo

### Descripción
Definición de la estructura de la página de catálogo.

### Archivo: `app/catalogo/page.tsx`
```typescript
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { ProductCard } from '@/components/ProductCard'
import { CartButton } from '@/components/cart/CartButton'
import { FloatingAssistantButton } from '@/components/assistants/FloatingAssistantButton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Search, Filter, Grid, List } from 'lucide-react'

export default function CatalogoPage() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [ordenar, setOrdenar] = useState('recientes')
  const [vistaGrid, setVistaGrid] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del catálogo */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Catálogo de Productos
          </h1>
          <p className="text-gray-600">
            Encuentra todo lo que necesitas en nuestras farmacias
          </p>
        </div>
      </div>

      {/* Filtros */}
      <FilterSection {...filterProps} />

      {/* Grid de productos */}
      <ProductGrid productos={productos} loading={loading} vistaGrid={vistaGrid} />

      {/* Botones flotantes */}
      <CartButton />
      <FloatingAssistantButton />
    </div>
  )
}
```

### Resultado
✅ Estructura base del catálogo

---

## Paso 2: Sistema de filtros

### Descripción
Implementación de filtros para búsqueda y categorización.

### Implementación
```typescript
function FilterSection({ 
  searchTerm, 
  setSearchTerm, 
  categoria, 
  setCategoria,
  ordenar,
  setOrdenar,
  vistaGrid,
  setVistaGrid
}) {
  const categorias = [
    { value: 'todas', label: 'Todas las categorías' },
    { value: 'medicamentos', label: 'Medicamentos' },
    { value: 'parafarmacia', label: 'Parafarmacia' },
    { value: 'cosmetica', label: 'Cosmética' },
    { value: 'higiene', label: 'Higiene' },
    { value: 'infantil', label: 'Infantil' },
    { value: 'nutricion', label: 'Nutrición' },
  ]

  const ordenOptions = [
    { value: 'recientes', label: 'Más recientes' },
    { value: 'precio_asc', label: 'Precio: menor a mayor' },
    { value: 'precio_desc', label: 'Precio: mayor a menor' },
    { value: 'nombre_asc', label: 'Nombre: A-Z' },
    { value: 'nombre_desc', label: 'Nombre: Z-A' },
  ]

  return (
    <div className="bg-white border-b sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categoría */}
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Ordenar */}
          <Select value={ordenar} onValueChange={setOrdenar}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {ordenOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Vista */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={vistaGrid ? "default" : "ghost"}
              size="icon"
              onClick={() => setVistaGrid(true)}
              className={vistaGrid ? "bg-[#1ABBB3]" : ""}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={!vistaGrid ? "default" : "ghost"}
              size="icon"
              onClick={() => setVistaGrid(false)}
              className={!vistaGrid ? "bg-[#1ABBB3]" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Resultado
✅ Filtros de búsqueda, categoría y ordenación

---

## Paso 3: Carga de productos

### Descripción
Lógica para cargar productos desde Supabase con filtros aplicados.

### Implementación
```typescript
useEffect(() => {
  async function fetchProductos() {
    setLoading(true)
    
    let query = supabase
      .from('productos')
      .select(`
        *,
        farmacias (
          id,
          nombre,
          ciudad
        )
      `)
      .eq('activo', true)

    // Filtro de categoría
    if (categoria !== 'todas') {
      query = query.eq('categoria', categoria)
    }

    // Búsqueda por texto
    if (searchTerm) {
      query = query.or(`nombre.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`)
    }

    // Ordenación
    switch (ordenar) {
      case 'precio_asc':
        query = query.order('precio', { ascending: true })
        break
      case 'precio_desc':
        query = query.order('precio', { ascending: false })
        break
      case 'nombre_asc':
        query = query.order('nombre', { ascending: true })
        break
      case 'nombre_desc':
        query = query.order('nombre', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error cargando productos:', error)
    } else {
      setProductos(data || [])
    }
    
    setLoading(false)
  }

  // Debounce para búsqueda
  const timeoutId = setTimeout(fetchProductos, 300)
  return () => clearTimeout(timeoutId)
}, [searchTerm, categoria, ordenar])
```

### Características
- **Filtro por categoría** - Productos de una categoría específica
- **Búsqueda de texto** - En nombre y descripción
- **Ordenación** - Por precio, nombre o fecha
- **Debounce** - 300ms para evitar llamadas excesivas

### Resultado
✅ Carga optimizada con filtros

---

## Paso 4: Grid de productos

### Descripción
Renderizado del grid de productos con soporte para vista de lista.

### Implementación
```typescript
function ProductGrid({ productos, loading, vistaGrid }) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={vistaGrid 
          ? "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} isGrid={vistaGrid} />
          ))}
        </div>
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white rounded-xl p-12 shadow-sm">
          <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600 mb-6">
            Intenta con otros términos de búsqueda o filtros
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('')
              setCategoria('todas')
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Contador de resultados */}
      <p className="text-sm text-gray-600 mb-4">
        {productos.length} producto{productos.length !== 1 && 's'} encontrado{productos.length !== 1 && 's'}
      </p>

      <div className={vistaGrid 
        ? "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        : "space-y-4"
      }>
        {productos.map((producto) => (
          <ProductCard 
            key={producto.id} 
            product={producto} 
            isListView={!vistaGrid}
          />
        ))}
      </div>
    </div>
  )
}
```

### Resultado
✅ Grid responsive con vista alternativa de lista

---

## Paso 5: Paginación y estados

### Descripción
Manejo de paginación y estados de carga/error/vacío.

### Implementación
```typescript
const PRODUCTOS_POR_PAGINA = 12

const [pagina, setPagina] = useState(1)
const [totalProductos, setTotalProductos] = useState(0)

// En el fetch
const { data, error, count } = await query
  .range((pagina - 1) * PRODUCTOS_POR_PAGINA, pagina * PRODUCTOS_POR_PAGINA - 1)

setTotalProductos(count || 0)

// Componente de paginación
function Pagination({ pagina, total, porPagina, onChange }) {
  const totalPaginas = Math.ceil(total / porPagina)
  
  if (totalPaginas <= 1) return null

  return (
    <div className="flex justify-center items-center gap-2 py-8">
      <Button
        variant="outline"
        disabled={pagina === 1}
        onClick={() => onChange(pagina - 1)}
      >
        Anterior
      </Button>
      
      <span className="px-4 text-sm text-gray-600">
        Página {pagina} de {totalPaginas}
      </span>
      
      <Button
        variant="outline"
        disabled={pagina === totalPaginas}
        onClick={() => onChange(pagina + 1)}
      >
        Siguiente
      </Button>
    </div>
  )
}

// Estados de la UI
const estados = {
  loading: <SkeletonGrid />,
  empty: <EmptyState onClear={clearFilters} />,
  error: <ErrorState onRetry={fetchProductos} />,
  success: <ProductGrid productos={productos} />
}
```

### Estados manejados
| Estado | Descripción | UI |
|--------|-------------|-----|
| `loading` | Cargando productos | Skeleton grid |
| `empty` | Sin resultados | Mensaje + limpiar filtros |
| `error` | Error de carga | Mensaje + reintentar |
| `success` | Productos cargados | Grid de ProductCard |

### Resultado
✅ Paginación y gestión de estados completa

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `app/catalogo/page.tsx` | Página del catálogo |
| `components/ProductCard.tsx` | Card de producto |
| `lib/supabaseClient.ts` | Cliente de Supabase |

---

## ✅ Checklist de Completado

- [x] Estructura del catálogo definida
- [x] Sistema de filtros implementado
- [x] Carga de productos optimizada
- [x] Grid responsive implementado
- [x] Paginación y estados manejados

---

[← Anterior: 2.1 Landing](../2.1_Landing_Page/README.md) | [Siguiente: 2.3 ProductCard →](../2.3_ProductCard_Componente/README.md)

