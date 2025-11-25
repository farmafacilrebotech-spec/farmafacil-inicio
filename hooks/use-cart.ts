import { useState, useEffect } from "react";
import { 
  getCart, 
  addToCart as addToCartLib, 
  removeFromCart as removeFromCartLib,
  updateCartItemQuantity as updateQuantityLib,
  clearCart as clearCartLib,
  getCartTotal,
  getCartItemCount,
  CartItem
} from "@/lib/cart";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  const updateCart = () => {
    setCart(getCart());
    setTotal(getCartTotal());
    setItemCount(getCartItemCount());
  };

  useEffect(() => {
    updateCart();

    // Escuchar cambios en el carrito
    const handleCartUpdate = () => {
      updateCart();
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  const addToCart = (item: CartItem) => {
    addToCartLib(item);
  };

  const removeFromCart = (producto_id: string) => {
    removeFromCartLib(producto_id);
  };

  const updateQuantity = (producto_id: string, cantidad: number) => {
    updateQuantityLib(producto_id, cantidad);
  };

  const clearCart = () => {
    clearCartLib();
  };

  return {
    cart,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}

