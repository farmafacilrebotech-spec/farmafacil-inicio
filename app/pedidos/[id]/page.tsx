"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { addToCart } from "@/lib/cart";

export default function PedidoDetalle() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [pedido, setPedido] = useState<any>(null);
  const [detalles, setDetalles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchPedidoDetalle(params.id as string);
    }
  }, [params.id]);

  const fetchPedidoDetalle = async (pedidoId: string) => {
    try {
      // Obtener pedido
      const { data: pedidoData } = await supabase
        .from("pedidos")
        .select(`
          *,
          farmacias(nombre, telefono, whatsapp, direccion, email),
          clientes(nombre, email, telefono)
        `)
        .eq("id", pedidoId)
        .single();

      // Obtener detalles
      const { data: detallesData } = await supabase
        .from("detalles_pedido")
        .select(`
          *,
          productos(id, nombre, precio, imagen_url, descripcion, stock)
        `)
        .eq("pedido_id", pedidoId);

      setPedido(pedidoData);
      setDetalles(detallesData || []);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el pedido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepeatOrder = async () => {
    try {
      let addedCount = 0;
      for (const detalle of detalles) {
        const producto = detalle.productos;
        if (producto && producto.stock > 0) {
          addToCart({
            producto_id: producto.id,
            nombre: producto.nombre,
            precio: parseFloat(producto.precio),
            cantidad: Math.min(detalle.cantidad, producto.stock),
            imagen_url: producto.imagen_url,
            farmacia_id: pedido.farmacia_id,
            farmacia_nombre: pedido.farmacias?.nombre,
            stock: producto.stock,
          });
          addedCount++;
        }
      }

      if (addedCount > 0) {
        toast({
          title: "¡Productos añadidos!",
          description: `${addedCount} producto(s) añadidos al carrito`,
        });
        router.push("/checkout");
      } else {
        toast({
          title: "Sin stock",
          description: "Los productos no están disponibles actualmente",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo repetir el pedido",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-[#F7F9FA]">
        <Navbar />
        <div className="pt-24 pb-12 px-4 text-center">
          <p className="text-gray-500">Pedido no encontrado</p>
          <Button
            onClick={() => router.push("/cliente/dashboard")}
            className="mt-4 bg-[#1ABBB3] hover:bg-[#4ED3C2]"
          >
            Volver al Dashboard
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#1A1A1A]">
              Pedido #{pedido.id.slice(0, 8).toUpperCase()}
            </h1>
            <Button
              onClick={handleRepeatOrder}
              className="bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Repetir Pedido
            </Button>
          </div>

          {/* Información del pedido */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Información del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
                <p><strong>Estado:</strong> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                    pedido.estado === "Completado" ? "bg-green-100 text-green-700" :
                    pedido.estado === "Enviado" ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {pedido.estado}
                  </span>
                </p>
                <p><strong>Total:</strong> {parseFloat(pedido.total).toFixed(2)}€</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Farmacia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Nombre:</strong> {pedido.farmacias.nombre}</p>
                <p><strong>Teléfono:</strong> {pedido.farmacias.telefono}</p>
                {pedido.farmacias.whatsapp && (
                  <p><strong>WhatsApp:</strong> {pedido.farmacias.whatsapp}</p>
                )}
                {pedido.farmacias.direccion && (
                  <p><strong>Dirección:</strong> {pedido.farmacias.direccion}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Productos del pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Productos ({detalles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {detalles.map((detalle) => (
                  <div 
                    key={detalle.id} 
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {detalle.productos.imagen_url ? (
                      <Image
                        src={detalle.productos.imagen_url}
                        alt={detalle.productos.nombre}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{detalle.productos.nombre}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {detalle.productos.descripcion}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Cantidad: {detalle.cantidad} × {parseFloat(detalle.productos.precio).toFixed(2)}€
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#1ABBB3]">
                        {parseFloat(detalle.subtotal).toFixed(2)}€
                      </p>
                      {detalle.productos.stock > 0 ? (
                        <p className="text-xs text-green-600 mt-1">En stock</p>
                      ) : (
                        <p className="text-xs text-red-600 mt-1">Sin stock</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-xl font-semibold">Total del Pedido:</span>
                  <span className="text-2xl font-bold text-[#1ABBB3]">
                    {parseFloat(pedido.total).toFixed(2)}€
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}

