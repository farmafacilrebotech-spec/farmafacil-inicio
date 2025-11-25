// Gestión del carrito de compras con localStorage

export interface CartItem {
  producto_id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen_url?: string;
  farmacia_id: string;
  farmacia_nombre?: string;
  stock: number;
}

const CART_KEY = "farmafacil_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error reading cart:", error);
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Disparar evento personalizado para actualizar otros componentes
    window.dispatchEvent(new Event("cart-updated"));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    (i) => i.producto_id === item.producto_id && i.farmacia_id === item.farmacia_id
  );

  if (existingIndex > -1) {
    // Si ya existe, aumentar cantidad
    cart[existingIndex].cantidad += item.cantidad;
    // No exceder el stock
    if (cart[existingIndex].cantidad > cart[existingIndex].stock) {
      cart[existingIndex].cantidad = cart[existingIndex].stock;
    }
  } else {
    // Añadir nuevo item
    cart.push(item);
  }

  saveCart(cart);
}

export function removeFromCart(producto_id: string): void {
  const cart = getCart();
  const newCart = cart.filter((item) => item.producto_id !== producto_id);
  saveCart(newCart);
}

export function updateCartItemQuantity(producto_id: string, cantidad: number): void {
  const cart = getCart();
  const item = cart.find((i) => i.producto_id === producto_id);
  
  if (item) {
    item.cantidad = Math.min(Math.max(1, cantidad), item.stock);
  }
  
  saveCart(cart);
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

export function getCartItemCount(): number {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.cantidad, 0);
}

