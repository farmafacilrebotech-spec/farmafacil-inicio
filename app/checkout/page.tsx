"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Smartphone, Loader2 } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();
  const { toast } = useToast();
  const [clienteId, setClienteId] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bizum">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Datos de facturación
  const [billingData, setBillingData] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (cart.length === 0 && !isLoading) {
      router.push("/catalogo");
    }
  }, [cart, isLoading, router]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: cliente } = await supabase
      .from("clientes")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!cliente) {
      toast({
        title: "Error",
        description: "Debes ser cliente para realizar pedidos",
        variant: "destructive",
      });
      router.push("/catalogo");
      return;
    }

    setClienteId(cliente.id);
    setClienteNombre(cliente.nombre);
    setBillingData({
      nombre: cliente.nombre || "",
      telefono: cliente.telefono || "",
      direccion: "",
      ciudad: "",
      codigoPostal: "",
    });
    setIsLoading(false);
  };

  const handleProcessPayment = async () => {
    if (!billingData.nombre || !billingData.telefono) {
      toast({
        title: "Datos incompletos",
        description: "Por favor, completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Agrupar productos por farmacia
      const pedidosPorFarmacia = cart.reduce((acc: any, item) => {
        if (!acc[item.farmacia_id]) {
          acc[item.farmacia_id] = [];
        }
        acc[item.farmacia_id].push(item);
        return {};
      }, {});

      // Crear pedido
      for (const [farmacia_id, productos] of Object.entries(pedidosPorFarmacia)) {
        const totalFarmacia = (productos as any[]).reduce(
          (sum, p) => sum + p.precio * p.cantidad,
          0
        );

        // Insertar pedido
        const { data: pedido, error: pedidoError } = await supabase
          .from("pedidos")
          .insert({
            cliente_id: clienteId,
            farmacia_id,
            total: totalFarmacia,
            estado: "Pendiente",
          })
          .select()
          .single();

        if (pedidoError) throw pedidoError;

        // Insertar detalles del pedido
        const detalles = (productos as any[]).map((p) => ({
          pedido_id: pedido.id,
          producto_id: p.producto_id,
          cantidad: p.cantidad,
          subtotal: p.precio * p.cantidad,
        }));

        const { error: detallesError } = await supabase
          .from("detalles_pedido")
          .insert(detalles);

        if (detallesError) throw detallesError;

        // Actualizar stock
        for (const producto of productos as any[]) {
          const { error: stockError } = await supabase
            .from("productos")
            .update({ 
              stock: producto.stock - producto.cantidad 
            })
            .eq("id", producto.producto_id);

          if (stockError) console.error("Error updating stock:", stockError);
        }
      }

      // Limpiar carrito
      clearCart();

      // Mostrar éxito
      toast({
        title: "¡Pedido realizado!",
        description: "Tu pedido se ha procesado correctamente",
      });

      // Redirigir al dashboard
      setTimeout(() => {
        router.push("/cliente/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast({
        title: "Error al procesar el pago",
        description: error.message || "Intenta de nuevo más tarde",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1ABBB3]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-8">
            Finalizar Pedido
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulario de datos */}
            <div className="lg:col-span-2 space-y-6">
              {/* Datos de contacto */}
              <Card>
                <CardHeader>
                  <CardTitle>Datos de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre completo *</Label>
                    <Input
                      id="nombre"
                      value={billingData.nombre}
                      onChange={(e) =>
                        setBillingData({ ...billingData, nombre: e.target.value })
                      }
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      value={billingData.telefono}
                      onChange={(e) =>
                        setBillingData({ ...billingData, telefono: e.target.value })
                      }
                      placeholder="600 123 456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={billingData.direccion}
                      onChange={(e) =>
                        setBillingData({ ...billingData, direccion: e.target.value })
                      }
                      placeholder="Calle Principal, 123"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input
                        id="ciudad"
                        value={billingData.ciudad}
                        onChange={(e) =>
                          setBillingData({ ...billingData, ciudad: e.target.value })
                        }
                        placeholder="Madrid"
                      />
                    </div>
                    <div>
                      <Label htmlFor="codigoPostal">Código Postal</Label>
                      <Input
                        id="codigoPostal"
                        value={billingData.codigoPostal}
                        onChange={(e) =>
                          setBillingData({
                            ...billingData,
                            codigoPostal: e.target.value,
                          })
                        }
                        placeholder="28001"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Método de pago */}
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: any) => setPaymentMethod(value)}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-[#1ABBB3]" />
                          <span className="font-semibold">Tarjeta de Crédito/Débito</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Pago seguro con Stripe
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="bizum" id="bizum" />
                      <Label htmlFor="bizum" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-[#1ABBB3]" />
                          <span className="font-semibold">Bizum</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Pago instantáneo desde tu móvil
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Nota:</strong> En este momento, los pedidos se procesarán
                      sin pago online. La farmacia te contactará para coordinar el pago y la entrega.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumen del pedido */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.producto_id} className="flex gap-3">
                        {item.imagen_url ? (
                          <Image
                            src={item.imagen_url}
                            alt={item.nombre}
                            width={50}
                            height={50}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {item.nombre}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.cantidad} × {item.precio.toFixed(2)}€
                          </p>
                        </div>
                        <p className="font-bold text-[#1ABBB3]">
                          {(item.cantidad * item.precio).toFixed(2)}€
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{total.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Envío:</span>
                      <span className="text-green-600">GRATIS</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-[#1ABBB3]">{total.toFixed(2)}€</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="w-full bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white py-6 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      `Confirmar Pedido (${total.toFixed(2)}€)`
                    )}
                  </Button>
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

