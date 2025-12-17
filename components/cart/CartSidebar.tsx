"use client";

import { X, Minus, Plus, Trash2, ShoppingBag, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatDistance } from "@/lib/distance";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, total, updateQuantity, removeFromCart, farmaciaAsignada, clearFarmaciaAsignada } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  // Verificar si hay productos de diferentes farmacias
  const farmaciasEnCarrito = Array.from(new Set(cart.map(item => item.farmacia_id)));
  const tieneMultiplesFarmacias = farmaciasEnCarrito.length > 1;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">
            Mi Carrito
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400">
                Añade productos desde el catálogo
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.producto_id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  {/* Imagen del producto */}
                  {item.imagen_url ? (
                    <Image
                      src={item.imagen_url}
                      alt={item.nombre}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  {/* Info del producto */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1A1A1A] mb-1">
                      {item.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.farmacia_nombre || "Farmacia"}
                    </p>
                    <p className="text-lg font-bold text-[#1ABBB3]">
                      {item.precio.toFixed(2)}€
                    </p>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.producto_id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">
                        {item.cantidad}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.producto_id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.producto_id)}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con total y botón */}
        {cart.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Mostrar farmacia asignada si existe */}
            {farmaciaAsignada && (
              <div className="bg-[#4ED3C2] bg-opacity-10 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <Store className="h-5 w-5 text-[#1ABBB3] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#1A1A1A]">
                        {farmaciaAsignada.nombre}
                      </p>
                      {farmaciaAsignada.distancia && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          A {formatDistance(farmaciaAsignada.distancia)}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={clearFarmaciaAsignada}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            )}

            {/* Aviso si hay productos de múltiples farmacias */}
            {tieneMultiplesFarmacias && !farmaciaAsignada && (
              <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-800">
                <p>
                  Tienes productos de diferentes farmacias. Al pagar, se asignará la farmacia más cercana.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">
                Total:
              </span>
              <span className="text-2xl font-bold text-[#1ABBB3]">
                {total.toFixed(2)}€
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white py-6 text-lg"
            >
              Proceder al Pago
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

