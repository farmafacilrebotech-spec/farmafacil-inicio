"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, Package, User, Calendar, DollarSign } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export default function FarmaciaPedidosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [farmaciaId, setFarmaciaId] = useState("");
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState<any>(null);
  const [detallesPedido, setDetallesPedido] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: farmacia } = await supabase
      .from("farmacias")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!farmacia) {
      router.push("/catalogo");
      return;
    }

    setFarmaciaId(farmacia.id);
    await fetchPedidos(farmacia.id);
    setIsLoading(false);
  };

  const fetchPedidos = async (fId: string) => {
    const response = await fetch(`/api/orders/list?farmacia_id=${fId}`);
    const data = await response.json();
    if (data.success) {
      setPedidos(data.pedidos);
    }
  };

  const handleEstadoChange = async (pedidoId: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from("pedidos")
        .update({ estado: nuevoEstado })
        .eq("id", pedidoId);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: `El pedido ahora está en estado: ${nuevoEstado}`,
      });

      // Actualizar lista
      await fetchPedidos(farmaciaId);
      
      // Si hay un pedido seleccionado, actualizarlo
      if (selectedPedido?.id === pedidoId) {
        setSelectedPedido({ ...selectedPedido, estado: nuevoEstado });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const handleVerDetalle = async (pedido: any) => {
    setSelectedPedido(pedido);
    
    // Obtener detalles
    const { data: detalles } = await supabase
      .from("detalles_pedido")
      .select(`
        *,
        productos(nombre, precio, imagen_url)
      `)
      .eq("pedido_id", pedido.id);

    setDetallesPedido(detalles || []);
  };

  const getEstadoBadge = (estado: string) => {
    const colores: any = {
      Pendiente: "bg-yellow-100 text-yellow-700",
      "En preparación": "bg-blue-100 text-blue-700",
      Enviado: "bg-purple-100 text-purple-700",
      Completado: "bg-green-100 text-green-700",
      Cancelado: "bg-red-100 text-red-700",
    };
    
    return colores[estado] || "bg-gray-100 text-gray-700";
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
              Gestión de Pedidos
            </h1>
            <p className="text-gray-600">
              Gestiona todos los pedidos de tu farmacia
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lista de pedidos */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pedidos ({pedidos.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {pedidos.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No hay pedidos aún</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pedidos.map((pedido) => (
                        <div
                          key={pedido.id}
                          className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                            selectedPedido?.id === pedido.id
                              ? "border-[#1ABBB3] bg-blue-50"
                              : ""
                          }`}
                          onClick={() => handleVerDetalle(pedido)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-lg">
                                Pedido #{pedido.id.slice(0, 8).toUpperCase()}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(pedido.fecha).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getEstadoBadge(pedido.estado)}>
                              {pedido.estado}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">
                                {pedido.clientes?.nombre || "Cliente"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              <span className="font-semibold text-[#1ABBB3]">
                                {parseFloat(pedido.total).toFixed(2)}€
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <Select
                              value={pedido.estado}
                              onValueChange={(value) =>
                                handleEstadoChange(pedido.id, value)
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                <SelectItem value="En preparación">
                                  En preparación
                                </SelectItem>
                                <SelectItem value="Enviado">Enviado</SelectItem>
                                <SelectItem value="Completado">Completado</SelectItem>
                                <SelectItem value="Cancelado">Cancelado</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVerDetalle(pedido);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Detalle del pedido seleccionado */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Detalle del Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedPedido ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        Selecciona un pedido para ver los detalles
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Info del cliente */}
                      <div className="p-3 bg-gray-50 rounded-lg space-y-2 text-sm">
                        <p>
                          <strong>Cliente:</strong>{" "}
                          {selectedPedido.clientes?.nombre}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {selectedPedido.clientes?.email}
                        </p>
                        <p>
                          <strong>Teléfono:</strong>{" "}
                          {selectedPedido.clientes?.telefono}
                        </p>
                      </div>

                      {/* Productos */}
                      <div>
                        <h4 className="font-semibold mb-3">Productos:</h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {detallesPedido.map((detalle) => (
                            <div
                              key={detalle.id}
                              className="flex justify-between items-start text-sm"
                            >
                              <div className="flex-1">
                                <p className="font-medium">
                                  {detalle.productos.nombre}
                                </p>
                                <p className="text-gray-500">
                                  {detalle.cantidad} ×{" "}
                                  {parseFloat(detalle.productos.precio).toFixed(2)}€
                                </p>
                              </div>
                              <p className="font-bold text-[#1ABBB3]">
                                {parseFloat(detalle.subtotal).toFixed(2)}€
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total:</span>
                          <span className="text-xl font-bold text-[#1ABBB3]">
                            {parseFloat(selectedPedido.total).toFixed(2)}€
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

