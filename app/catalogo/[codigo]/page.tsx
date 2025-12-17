"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Store, MapPin, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/ProductCard";
import FloatingAssistantButton from "@/components/assistants/FloatingAssistantButton";
import CartButton from "@/components/cart/CartButton";

interface Farmacia {
  id: string;
  codigo: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  ciudad?: string;
  logo_url?: string;
}

interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria?: string;
  imagen_url?: string;
  farmacia_id: string;
}

const CATEGORIAS = [
  "todas",
  "Analgésicos",
  "Vitaminas",
  "Cuidado personal",
  "Primeros auxilios",
  "Medicamentos",
  "Suplementos",
];

export default function CatalogoFarmaciaPage() {
  const params = useParams();
  const codigo = params.codigo as string;

  const [farmacia, setFarmacia] = useState<Farmacia | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (codigo) {
      fetchFarmaciaYProductos();
    }
  }, [codigo]);

  useEffect(() => {
    filterProductos();
  }, [searchTerm, selectedCategory, productos]);

  const fetchFarmaciaYProductos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtener farmacia por código
      const farmaciaResponse = await fetch(`/api/farmacias/${codigo}`);
      const farmaciaData = await farmaciaResponse.json();

      if (!farmaciaData.success || !farmaciaData.farmacia) {
        setError("Farmacia no encontrada");
        setIsLoading(false);
        return;
      }

      setFarmacia(farmaciaData.farmacia);

      // Obtener productos de la farmacia
      const productosResponse = await fetch(
        `/api/products/list?farmacia_id=${farmaciaData.farmacia.id}`
      );
      const productosData = await productosResponse.json();

      if (productosData.success) {
        setProductos(productosData.productos || []);
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("Error al cargar la información");
    } finally {
      setIsLoading(false);
    }
  };

  const filterProductos = () => {
    let filtered = productos;

    if (selectedCategory !== "todas") {
      filtered = filtered.filter((p) => p.categoria === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProductos(filtered);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ABBB3] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error || !farmacia) {
    return (
      <div className="min-h-screen bg-[#F7F9FA]">
        <Navbar />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Farmacia no encontrada
            </h1>
            <p className="text-gray-600 mb-6">
              El código "{codigo}" no corresponde a ninguna farmacia registrada.
            </p>
            <Link href="/catalogo">
              <Button className="bg-[#1ABBB3] hover:bg-[#4ED3C2]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Ir al catálogo general
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header de la farmacia */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-start gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                {farmacia.logo_url ? (
                  <img
                    src={farmacia.logo_url}
                    alt={farmacia.nombre}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3] flex items-center justify-center">
                    <Store className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                  {farmacia.nombre}
                </h1>

                <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                  {farmacia.direccion && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-[#1ABBB3]" />
                      <span>
                        {farmacia.direccion}
                        {farmacia.ciudad && `, ${farmacia.ciudad}`}
                      </span>
                    </div>
                  )}
                  {farmacia.telefono && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-[#1ABBB3]" />
                      <span>{farmacia.telefono}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Volver */}
              <Link href="/catalogo">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Catálogo general
                </Button>
              </Link>
            </div>
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
          {filteredProductos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {productos.length === 0
                  ? "Esta farmacia aún no tiene productos"
                  : "No se encontraron productos con esos filtros"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProductos.map((producto) => (
                <ProductCard
                  key={producto.id}
                  id={producto.id}
                  nombre={producto.nombre}
                  descripcion={producto.descripcion || ""}
                  precio={producto.precio}
                  stock={producto.stock}
                  imagen_url={producto.imagen_url || ""}
                  categoria={producto.categoria || ""}
                  farmacia_id={producto.farmacia_id}
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

