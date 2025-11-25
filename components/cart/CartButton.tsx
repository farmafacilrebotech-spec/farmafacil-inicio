"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartSidebar from "@/components/cart/CartSidebar";
import { useCart } from "@/hooks/use-cart";

export default function CartButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      {/* Botón flotante del carrito */}
      <div className="fixed bottom-6 right-24 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-[#4ED3C2] to-[#1ABBB3] hover:from-[#1ABBB3] hover:to-[#4ED3C2] shadow-lg hover:shadow-xl transition-all relative"
        >
          <ShoppingCart className="h-6 w-6 text-white" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </div>

      {/* Sidebar del carrito */}
      <CartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

