"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, Clock, RefreshCw, Eye } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/lib/cart";
import { getClienteSession } from "@/lib/sessionManager";

export default function ClienteDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [clienteId, setClienteId] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPedidos: 0,
    totalGastado: 0,
    ultimoPedido: null as Date | null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Verificar sesión de cliente usando sessionManager
    const session = getClienteSession();
    
    if (!session) {
      router.push("/login-cliente");
      return;
    }

    setClienteId(session.cliente_id);
    setClienteNombre(session.nombre || "Cliente");
    await fetchPedidos(session.cliente_id);
    setIsLoading(false);
  };

  const fetchPedidos = async (clienteId: string) => {
    try {
      const response = await fetch(`/api/orders/list?cliente_id=${clienteId}`);
      const data = await response.json();
      
      if (data.success) {
        setPedidos(data.pedidos);
        
        // Calcular estadísticas
        const total = data.pedidos.reduce((sum: number, p: any) => sum + parseFloat(p.total), 0);
        const ultimo = data.pedidos.length > 0 ? new Date(data.pedidos[0].fecha) : null;
        
        setStats({
          totalPedidos: data.pedidos.length,
          totalGastado: total,
          ultimoPedido: ultimo,
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleRepeatOrder = async (pedidoId: string) => {
    try {
      // Obtener detalles del pedido
      const { data: detalles } = await supabase
        .from("detalles_pedido")
        .select(`
          *,
          productos(*),
          pedidos!inner(farmacia_id, farmacias(nombre))
        `)
        .eq("pedido_id", pedidoId);

      if (!detalles || detalles.length === 0) {
        toast({ 
          title: "Error", 
          description: "No se encontraron productos", 
          variant: "destructive" 
        });
        return;
      }

      // Verificar stock y añadir al carrito
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
            farmacia_id: detalle.pedidos.farmacia_id,
            farmacia_nombre: detalle.pedidos.farmacias?.nombre,
            stock: producto.stock,
          });
          addedCount++;
        }
      }

      if (addedCount > 0) {
        toast({ 
          title: "¡Productos añadidos!", 
          description: `${addedCount} producto(s) añadidos al carrito` 
        });
      } else {
        toast({ 
          title: "Sin stock", 
          description: "Los productos no están disponibles actualmente", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error repeating order:", error);
      toast({ 
        title: "Error", 
        description: "No se pudo repetir el pedido", 
        variant: "destructive" 
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

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">
              Bienvenido, {clienteNombre}
            </h1>
            <p className="text-gray-600">Gestiona tus pedidos y compras</p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Pedidos</p>
                    <p className="text-3xl font-bold text-[#1A1A1A]">{stats.totalPedidos}</p>
                  </div>
                  <ShoppingBag className="h-12 w-12 text-[#1ABBB3]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Gastado</p>
                    <p className="text-3xl font-bold text-[#1A1A1A]">{stats.totalGastado.toFixed(2)}€</p>
                  </div>
                  <Package className="h-12 w-12 text-[#1ABBB3]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Último Pedido</p>
                    <p className="text-lg font-semibold text-[#1A1A1A]">
                      {stats.ultimoPedido 
                        ? stats.ultimoPedido.toLocaleDateString() 
                        : "Sin pedidos"}
                    </p>
                  </div>
                  <Clock className="h-12 w-12 text-[#1ABBB3]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historial de Pedidos */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              {pedidos.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No tienes pedidos aún</p>
                  <Button
                    onClick={() => router.push("/catalogo")}
                    className="bg-[#1ABBB3] hover:bg-[#4ED3C2] mt-4"
                  >
                    Ir al Catálogo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {pedidos.map((pedido) => (
                    <div 
                      key={pedido.id} 
                      className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-lg">
                            Pedido #{pedido.id.slice(0, 8).toUpperCase()}
                          </p>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            pedido.estado === "Completado" ? "bg-green-100 text-green-700" :
                            pedido.estado === "Enviado" ? "bg-blue-100 text-blue-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {pedido.estado}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>📅 {new Date(pedido.fecha).toLocaleDateString()}</p>
                          <p>💰 Total: {parseFloat(pedido.total).toFixed(2)}€</p>
                          <p>🏪 {pedido.farmacias?.nombre || "Farmacia"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/pedidos/${pedido.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Button
                          className="bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white"
                          size="sm"
                          onClick={() => handleRepeatOrder(pedido.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Repetir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}

