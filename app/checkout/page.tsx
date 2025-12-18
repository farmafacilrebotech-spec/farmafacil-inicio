"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Loader2, 
  Building2, 
  Banknote,
  Store,
  Copy,
  Check,
  AlertCircle,
  Download,
  MessageCircle,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { MetodoPago, Farmacia } from "@/lib/supabase-helpers";

// Iconos para cada método de pago
const PAYMENT_ICONS: Record<MetodoPago, React.ReactNode> = {
  bizum: <Smartphone className="h-5 w-5" />,
  tarjeta: <CreditCard className="h-5 w-5" />,
  transferencia: <Building2 className="h-5 w-5" />,
  efectivo: <Banknote className="h-5 w-5" />,
};

// Labels para cada método de pago
const PAYMENT_LABELS: Record<MetodoPago, { title: string; description: string }> = {
  bizum: {
    title: "Bizum",
    description: "Pago instantáneo desde tu móvil",
  },
  tarjeta: {
    title: "Tarjeta de Crédito/Débito",
    description: "Pago seguro online",
  },
  transferencia: {
    title: "Transferencia Bancaria",
    description: "Transfiere el importe a la cuenta de la farmacia",
  },
  efectivo: {
    title: "Pago en Farmacia",
    description: "Paga al recoger tu pedido",
  },
};

// Tipo para la respuesta del pedido
interface PedidoConfirmado {
  id: string
  fecha: string
  total: number
  pdfBase64: string
  whatsappCliente: string
  whatsappFarmacia: string
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart, farmaciaAsignada } = useCart();
  const { toast } = useToast();
  const [clienteId, setClienteId] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<MetodoPago | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Datos de la farmacia con métodos de pago
  const [farmaciaData, setFarmaciaData] = useState<Farmacia | null>(null);
  const [loadingFarmacia, setLoadingFarmacia] = useState(true);
  
  // Modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<PedidoConfirmado | null>(null);

  // Datos de facturación
  const [billingData, setBillingData] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
  });

  // Cargar datos de la farmacia asignada
  useEffect(() => {
    const loadFarmaciaData = async () => {
      if (!farmaciaAsignada?.id) {
        setLoadingFarmacia(false);
        return;
      }

      try {
        const response = await fetch(`/api/farmacias?id=${farmaciaAsignada.id}`);
        const data = await response.json();
        
        if (data.success && data.farmacia) {
          setFarmaciaData(data.farmacia);
          // Seleccionar el primer método de pago disponible
          if (data.farmacia.metodos_pago?.length > 0) {
            setPaymentMethod(data.farmacia.metodos_pago[0]);
          }
        }
      } catch (error) {
        console.error("Error loading farmacia data:", error);
      } finally {
        setLoadingFarmacia(false);
      }
    };

    loadFarmaciaData();
  }, [farmaciaAsignada]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (cart.length === 0 && !isLoading && !showSuccessModal) {
      router.push("/catalogo");
    }
  }, [cart, isLoading, router, showSuccessModal]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Permitir checkout sin autenticación para demo
      setIsLoading(false);
      return;
    }

    const { data: cliente } = await supabase
      .from("clientes")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (cliente) {
      setClienteId(cliente.id);
      setClienteNombre(cliente.nombre);
      setBillingData({
        nombre: cliente.nombre || "",
        telefono: cliente.telefono || "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
      });
    }
    setIsLoading(false);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copiado",
        description: "Texto copiado al portapapeles",
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const formatIBAN = (iban: string) => {
    const cleaned = iban.replace(/\s/g, '');
    const visible = cleaned.slice(-4);
    const hidden = cleaned.slice(0, -4).replace(/./g, '•');
    return `${hidden.match(/.{1,4}/g)?.join(' ')} ${visible}`;
  };

  const downloadPDF = (base64: string, filename: string) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    if (!paymentMethod) {
      toast({
        title: "Método de pago requerido",
        description: "Por favor, selecciona un método de pago",
        variant: "destructive",
      });
      return;
    }

    if (!farmaciaAsignada?.id) {
      toast({
        title: "Farmacia no asignada",
        description: "Debes seleccionar una farmacia primero",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Llamar a la API para confirmar el pedido
      const response = await fetch('/api/pedidos/confirmar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clienteNombre: billingData.nombre,
          clienteTelefono: billingData.telefono,
          clienteDireccion: billingData.direccion || undefined,
          farmaciaId: farmaciaAsignada.id,
          productos: cart.map(item => ({
            producto_id: item.producto_id,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
          })),
          metodoPago: PAYMENT_LABELS[paymentMethod].title,
          total,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al procesar el pedido');
      }

      // Guardar datos del pedido confirmado
      setPedidoConfirmado({
        id: data.pedido.id,
        fecha: data.pedido.fecha,
        total: data.pedido.total,
        pdfBase64: data.recibo.pdf,
        whatsappCliente: data.whatsapp.cliente,
        whatsappFarmacia: data.whatsapp.farmacia,
      });

      // Mostrar modal de éxito
      setShowSuccessModal(true);

      // Limpiar carrito
      clearCart();

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

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push("/catalogo");
  };

  if (isLoading || loadingFarmacia) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1ABBB3]" />
      </div>
    );
  }

  // Si no hay farmacia asignada, mostrar mensaje
  if (!farmaciaAsignada) {
    return (
      <div className="min-h-screen bg-[#F7F9FA]">
        <Navbar />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Farmacia no asignada</h2>
              <p className="text-gray-600 mb-4">
                Debes seleccionar una farmacia antes de proceder al pago.
                Vuelve al carrito y usa el botón "Buscar farmacia cercana".
              </p>
              <Button 
                onClick={() => router.push("/catalogo")}
                className="bg-[#1ABBB3] hover:bg-[#4ED3C2]"
              >
                Volver al catálogo
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
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
              {/* Farmacia asignada */}
              <Card className="border-[#1ABBB3] border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Store className="h-5 w-5 text-[#1ABBB3]" />
                    Tu pedido irá a:
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1ABBB3] bg-opacity-10 p-3 rounded-full">
                      <Store className="h-6 w-6 text-[#1ABBB3]" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{farmaciaAsignada.nombre}</p>
                      {farmaciaAsignada.direccion && (
                        <p className="text-gray-600 text-sm">{farmaciaAsignada.direccion}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                    <Label htmlFor="telefono">Teléfono (para recibir el recibo por WhatsApp) *</Label>
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
                    <Label htmlFor="direccion">Dirección (opcional)</Label>
                    <Input
                      id="direccion"
                      value={billingData.direccion}
                      onChange={(e) =>
                        setBillingData({ ...billingData, direccion: e.target.value })
                      }
                      placeholder="Calle Principal, 123"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Método de pago */}
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pago</CardTitle>
                  <p className="text-sm text-gray-500">
                    Métodos disponibles en {farmaciaAsignada.nombre}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {farmaciaData?.metodos_pago && farmaciaData.metodos_pago.length > 0 ? (
                    <RadioGroup
                      value={paymentMethod || ""}
                      onValueChange={(value) => setPaymentMethod(value as MetodoPago)}
                      className="space-y-3"
                    >
                      {farmaciaData.metodos_pago.map((metodo) => (
                        <div key={metodo}>
                          <div 
                            className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                              paymentMethod === metodo 
                                ? 'border-[#1ABBB3] bg-[#1ABBB3] bg-opacity-5' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setPaymentMethod(metodo)}
                          >
                            <RadioGroupItem value={metodo} id={metodo} />
                            <Label htmlFor={metodo} className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <span className="text-[#1ABBB3]">
                                  {PAYMENT_ICONS[metodo]}
                                </span>
                                <span className="font-semibold">
                                  {PAYMENT_LABELS[metodo].title}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {PAYMENT_LABELS[metodo].description}
                              </p>
                            </Label>
                          </div>

                          {/* Información adicional según método seleccionado */}
                          {paymentMethod === metodo && (
                            <div className="mt-3 ml-8 p-4 bg-gray-50 rounded-lg">
                              {metodo === "bizum" && farmaciaData.bizum_telefono && (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-gray-700">
                                    Envía el Bizum a:
                                  </p>
                                  <div className="flex items-center gap-2 bg-white p-3 rounded border">
                                    <Smartphone className="h-5 w-5 text-[#1ABBB3]" />
                                    <span className="font-mono text-lg font-bold">
                                      {farmaciaData.bizum_telefono}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(farmaciaData.bizum_telefono!, 'bizum')}
                                      className="ml-auto"
                                    >
                                      {copiedField === 'bizum' ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Concepto: Pedido FarmaFácil - {billingData.nombre || 'Tu nombre'}
                                  </p>
                                </div>
                              )}

                              {metodo === "transferencia" && farmaciaData.iban && (
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                      Datos bancarios:
                                    </p>
                                    <div className="bg-white p-3 rounded border space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">IBAN:</span>
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono text-sm">
                                            {formatIBAN(farmaciaData.iban)}
                                          </span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(farmaciaData.iban!, 'iban')}
                                          >
                                            {copiedField === 'iban' ? (
                                              <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                              <Copy className="h-4 w-4" />
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                      {farmaciaData.titular_cuenta && (
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">Titular:</span>
                                          <span className="font-medium">
                                            {farmaciaData.titular_cuenta}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Concepto: Pedido FarmaFácil - {billingData.nombre || 'Tu nombre'}
                                  </p>
                                </div>
                              )}

                              {metodo === "tarjeta" && (
                                <div className="text-center py-2">
                                  <p className="text-sm text-gray-600">
                                    Serás redirigido a la pasarela de pago segura
                                  </p>
                                </div>
                              )}

                              {metodo === "efectivo" && (
                                <div className="space-y-2">
                                  <p className="text-sm text-gray-700">
                                    📍 Recoge y paga en:
                                  </p>
                                  <p className="font-medium">
                                    {farmaciaAsignada.nombre}
                                  </p>
                                  {farmaciaAsignada.direccion && (
                                    <p className="text-sm text-gray-600">
                                      {farmaciaAsignada.direccion}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                      <p>Esta farmacia no tiene métodos de pago configurados.</p>
                      <p className="text-sm">Contacta directamente con la farmacia.</p>
                    </div>
                  )}
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
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Store className="h-5 w-5 text-gray-400" />
                          </div>
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
                    disabled={isProcessing || !paymentMethod}
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

                  {paymentMethod && (
                    <p className="text-xs text-center text-gray-500">
                      Pagarás con: {PAYMENT_LABELS[paymentMethod].title}
                    </p>
                  )}
                  
                  <p className="text-xs text-center text-gray-400">
                    📱 Recibirás el recibo por WhatsApp
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              ¡Pedido Confirmado!
            </DialogTitle>
          </DialogHeader>

          {pedidoConfirmado && (
            <div className="space-y-6 py-4">
              {/* Info del pedido */}
              <div className="text-center bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Número de pedido:</p>
                <p className="text-2xl font-bold text-[#1ABBB3]">
                  #{pedidoConfirmado.id}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Total: {pedidoConfirmado.total.toFixed(2)}€
                </p>
              </div>

              {/* Acciones de WhatsApp */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-center text-gray-700">
                  📱 Envía el recibo por WhatsApp:
                </p>
                
                {/* Botón para cliente */}
                <a
                  href={pedidoConfirmado.whatsappCliente}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 p-2 rounded-full">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-green-800">Tu recibo</p>
                      <p className="text-xs text-green-600">Enviar a mi WhatsApp</p>
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 text-green-600" />
                </a>

                {/* Botón para farmacia */}
                {pedidoConfirmado.whatsappFarmacia && (
                  <a
                    href={pedidoConfirmado.whatsappFarmacia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 bg-[#1ABBB3] bg-opacity-10 border border-[#1ABBB3] border-opacity-30 rounded-lg hover:bg-opacity-20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-[#1ABBB3] p-2 rounded-full">
                        <Store className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-[#1A1A1A]">Notificar Farmacia</p>
                        <p className="text-xs text-gray-600">Enviar pedido a la farmacia</p>
                      </div>
                    </div>
                    <ExternalLink className="h-5 w-5 text-[#1ABBB3]" />
                  </a>
                )}
              </div>

              {/* Descargar PDF */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => downloadPDF(pedidoConfirmado.pdfBase64, `recibo_${pedidoConfirmado.id}.pdf`)}
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar Recibo PDF
              </Button>

              {/* Botón continuar */}
              <Button
                onClick={handleCloseSuccessModal}
                className="w-full bg-[#1ABBB3] hover:bg-[#4ED3C2]"
              >
                Continuar comprando
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
