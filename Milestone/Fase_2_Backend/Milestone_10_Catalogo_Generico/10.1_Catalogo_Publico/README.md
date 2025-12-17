# 📦 10.1 Catálogo Público

## 📋 Implementación

### Página del Catálogo Genérico

**Archivo**: `app/catalogo/page.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/ProductCard";
import FloatingAssistantButton from "@/components/assistants/FloatingAssistantButton";
import CartButton from "@/components/cart/CartButton";

const CATEGORIAS = [
  "todas",
  "Analgésicos",
  "Vitaminas",
  "Cuidado personal",
  "Primeros auxilios",
  "Medicamentos",
  "Suplementos",
];

export default function CatalogoPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    filterProductos();
  }, [searchTerm, selectedCategory, productos]);

  const fetchProductos = async () => {
    try {
      // Obtiene productos de TODAS las farmacias
      const response = await fetch("/api/products/list");
      const data = await response.json();
      if (data.success) {
        setProductos(data.productos);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProductos = () => {
    let filtered = productos;

    // Filtrar por categoría
    if (selectedCategory !== "todas") {
      filtered = filtered.filter((p) => p.categoria === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProductos(filtered);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
              Catálogo de Productos
            </h1>
            <p className="text-gray-600">
              Encuentra todos los productos disponibles en nuestras farmacias
            </p>
          </div>

          {/* Búsqueda y filtros */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categorías */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {CATEGORIAS.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className={
                    selectedCategory === cat
                      ? "bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white whitespace-nowrap"
                      : "whitespace-nowrap"
                  }
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid de productos */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando productos...</p>
            </div>
          ) : filteredProductos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProductos.map((producto) => (
                <ProductCard
                  key={producto.id}
                  {...producto}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
      
      {/* Botones flotantes - SOLO en catálogo */}
      <FloatingAssistantButton />
      <CartButton />
    </div>
  );
}
```

---

## 🎨 Diseño Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    CATÁLOGO GENÉRICO                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │  NAVBAR                                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Catálogo de Productos                                      │
│  Encuentra todos los productos disponibles                  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🔍 Buscar productos...                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [Todas] [Analgésicos] [Vitaminas] [Cuidado...] [Primeros]  │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  🖼️      │ │  🖼️      │ │  🖼️      │ │  🖼️      │       │
│  │ Producto │ │ Producto │ │ Producto │ │ Producto │       │
│  │ €9.99    │ │ €14.99   │ │ €7.50    │ │ €12.00   │       │
│  │[Añadir]  │ │[Añadir]  │ │[Añadir]  │ │[Añadir]  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  🖼️      │ │  🖼️      │ │  🖼️      │ │  🖼️      │       │
│  │ Producto │ │ Producto │ │ Producto │ │ Producto │       │
│  │ €5.99    │ │ €22.00   │ │ €8.99    │ │ €11.50   │       │
│  │[Añadir]  │ │[Añadir]  │ │[Añadir]  │ │[Añadir]  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  FOOTER                                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                                        🤖 Asistente         │
│                                        🛒 Carrito (3)       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Diferencias con Catálogo de Farmacia

| Característica | /catalogo (Genérico) | /catalogo/[codigo] (Farmacia) |
|----------------|---------------------|------------------------------|
| Productos | Todas las farmacias | Solo esa farmacia |
| Header | Genérico | Nombre de farmacia |
| Carrito | Asigna farmacia cercana | Farmacia fija |
| URL | /catalogo | /catalogo/FARM001 |

---

## ✅ Checklist

- [x] Página /catalogo creada
- [x] Fetch de todos los productos
- [x] Búsqueda por nombre
- [x] Filtro por categorías
- [x] Grid responsive
- [x] Asistente flotante
- [x] Carrito flotante

---

*Paso 1 de Milestone 10 - Catálogo Genérico*

