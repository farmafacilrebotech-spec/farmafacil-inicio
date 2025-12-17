# 🃏 Milestone 2.3: Componente ProductCard

## 📑 Índice de Pasos

1. [Paso 1: Estructura del componente](#paso-1-estructura-del-componente)
2. [Paso 2: Visualización de información](#paso-2-visualización-de-información)
3. [Paso 3: Integración con carrito](#paso-3-integración-con-carrito)
4. [Paso 4: Estados y animaciones](#paso-4-estados-y-animaciones)
5. [Paso 5: Vista de lista](#paso-5-vista-de-lista)

---

## Paso 1: Estructura del componente

### Descripción
Definición de la estructura y props del componente ProductCard.

### Archivo: `components/ProductCard.tsx`
```typescript
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'
import { addToCart } from '@/lib/cart'
import { toast } from 'sonner'

interface Product {
  id: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  imagen_url: string
  categoria: string
  farmacias: {
    id: string
    nombre: string
    ciudad?: string
  }
}

interface ProductCardProps {
  product: Product
  isListView?: boolean
}

export function ProductCard({ product, isListView = false }: ProductCardProps) {
  const [adding, setAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // Determinar si hay stock
  const inStock = product.stock > 0
  const lowStock = product.stock > 0 && product.stock <= 5

  if (isListView) {
    return <ProductCardList product={product} />
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.imagen_url || '/images/placeholder-product.png'}
          alt={product.nombre}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {!inStock && (
            <Badge variant="destructive">Agotado</Badge>
          )}
          {lowStock && inStock && (
            <Badge className="bg-orange-500">Últimas unidades</Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Contenido y acciones */}
      </CardContent>
    </Card>
  )
}
```

### Props definidas
| Prop | Tipo | Descripción |
|------|------|-------------|
| `product` | `Product` | Datos del producto |
| `isListView` | `boolean` | Si mostrar como lista |

### Resultado
✅ Estructura del componente definida

---

## Paso 2: Visualización de información

### Descripción
Mostrar la información del producto de forma clara y atractiva.

### Implementación
```typescript
<CardContent className="p-4">
  {/* Categoría */}
  <span className="text-xs text-[#1ABBB3] font-medium uppercase tracking-wide">
    {product.categoria}
  </span>

  {/* Nombre */}
  <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2 min-h-[2.5rem]">
    {product.nombre}
  </h3>

  {/* Descripción */}
  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
    {product.descripcion}
  </p>

  {/* Farmacia */}
  <p className="text-xs text-gray-400 mt-2">
    <span className="font-medium">{product.farmacias?.nombre}</span>
    {product.farmacias?.ciudad && (
      <span> · {product.farmacias.ciudad}</span>
    )}
  </p>

  {/* Precio */}
  <div className="flex items-center justify-between mt-4">
    <div>
      <span className="text-2xl font-bold text-gray-900">
        {product.precio.toFixed(2)}€
      </span>
      {product.precio_original && product.precio_original > product.precio && (
        <span className="text-sm text-gray-400 line-through ml-2">
          {product.precio_original.toFixed(2)}€
        </span>
      )}
    </div>
  </div>
</CardContent>
```

### Estilos aplicados
- **line-clamp-2** - Limitar texto a 2 líneas
- **min-h** - Altura mínima para consistencia
- **uppercase tracking-wide** - Categoría destacada
- **line-through** - Precio original tachado

### Resultado
✅ Información del producto visible y organizada

---

## Paso 3: Integración con carrito

### Descripción
Funcionalidad para añadir productos al carrito de compras.

### Implementación
```typescript
const handleAddToCart = async () => {
  if (!inStock) return

  setAdding(true)

  // Preparar item del carrito
  const cartItem = {
    producto_id: product.id,
    nombre: product.nombre,
    precio: product.precio,
    cantidad: quantity,
    imagen_url: product.imagen_url,
    farmacia_id: product.farmacias.id,
    farmacia_nombre: product.farmacias.nombre,
    stock: product.stock
  }

  // Añadir al carrito
  addToCart(cartItem)

  // Feedback visual
  toast.success(`${product.nombre} añadido al carrito`, {
    description: `Cantidad: ${quantity}`,
    action: {
      label: 'Ver carrito',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('openCart'))
      }
    }
  })

  // Reset estado
  setTimeout(() => {
    setAdding(false)
    setQuantity(1)
  }, 1500)
}

// Botón de añadir
<Button
  onClick={handleAddToCart}
  disabled={!inStock || adding}
  className={`w-full mt-4 ${
    adding 
      ? 'bg-green-500 hover:bg-green-500' 
      : 'bg-[#1ABBB3] hover:bg-[#158f89]'
  }`}
>
  {adding ? (
    <>
      <Check className="h-4 w-4 mr-2" />
      Añadido
    </>
  ) : (
    <>
      <ShoppingCart className="h-4 w-4 mr-2" />
      Añadir al carrito
    </>
  )}
</Button>
```

### Selector de cantidad
```typescript
{inStock && (
  <div className="flex items-center gap-2 mt-4">
    <Button
      variant="outline"
      size="icon"
      onClick={() => setQuantity(Math.max(1, quantity - 1))}
      disabled={quantity <= 1}
    >
      <Minus className="h-4 w-4" />
    </Button>
    
    <span className="w-8 text-center font-medium">
      {quantity}
    </span>
    
    <Button
      variant="outline"
      size="icon"
      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
      disabled={quantity >= product.stock}
    >
      <Plus className="h-4 w-4" />
    </Button>
  </div>
)}
```

### Resultado
✅ Carrito integrado con feedback visual

---

## Paso 4: Estados y animaciones

### Descripción
Implementación de estados visuales y animaciones para mejor UX.

### Estados visuales
```typescript
// Estado de hover
<Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">

// Animación de imagen
<Image
  className="object-cover group-hover:scale-105 transition-transform duration-300"
/>

// Estado de añadiendo
const buttonClasses = adding 
  ? 'bg-green-500 hover:bg-green-500 scale-95' 
  : 'bg-[#1ABBB3] hover:bg-[#158f89]'

// Estado deshabilitado (sin stock)
<Button disabled={!inStock || adding}>
  {!inStock ? 'Sin stock' : 'Añadir'}
</Button>

// Skeleton loading
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
      </CardContent>
    </Card>
  )
}
```

### Animaciones CSS
```css
/* En globals.css */
@keyframes pulse-success {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-success {
  animation: pulse-success 0.3s ease-in-out;
}

.product-card-enter {
  opacity: 0;
  transform: translateY(20px);
}

.product-card-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease-out;
}
```

### Resultado
✅ Estados y animaciones fluidas

---

## Paso 5: Vista de lista

### Descripción
Variante del componente para mostrar productos en formato lista.

### Implementación
```typescript
function ProductCardList({ product }: { product: Product }) {
  const [adding, setAdding] = useState(false)
  const inStock = product.stock > 0

  return (
    <Card className="flex overflow-hidden hover:shadow-md transition-shadow">
      {/* Imagen */}
      <div className="relative w-32 h-32 flex-shrink-0">
        <Image
          src={product.imagen_url || '/images/placeholder-product.png'}
          alt={product.nombre}
          fill
          className="object-cover"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Agotado</Badge>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#1ABBB3] font-medium uppercase">
                {product.categoria}
              </span>
              <h3 className="font-semibold text-gray-900">
                {product.nombre}
              </h3>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {product.precio.toFixed(2)}€
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
            {product.descripcion}
          </p>
          
          <p className="text-xs text-gray-400 mt-1">
            {product.farmacias?.nombre}
          </p>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-2 mt-2">
          <Button
            size="sm"
            onClick={() => handleAddToCart(product)}
            disabled={!inStock || adding}
            className={adding ? 'bg-green-500' : 'bg-[#1ABBB3]'}
          >
            {adding ? (
              <Check className="h-4 w-4" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Añadir
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
```

### Diferencias con vista grid
| Aspecto | Grid | Lista |
|---------|------|-------|
| Imagen | Cuadrada grande | Pequeña lateral |
| Descripción | 2 líneas | 1 línea |
| Selector cantidad | Visible | Oculto |
| Botón | Ancho completo | Compacto |

### Resultado
✅ Vista de lista implementada

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `components/ProductCard.tsx` | Componente principal |
| `lib/cart.ts` | Funciones del carrito |
| `hooks/use-cart.ts` | Hook del carrito |

---

## ✅ Checklist de Completado

- [x] Estructura del componente definida
- [x] Información del producto visible
- [x] Integración con carrito
- [x] Estados y animaciones
- [x] Vista de lista implementada

---

[← Anterior: 2.2 Catálogo](../2.2_Catalogo_Productos/README.md) | [Siguiente: 2.4 Páginas Info →](../2.4_Paginas_Informacion/README.md)

