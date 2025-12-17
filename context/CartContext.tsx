'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react'

// ============================================
// TIPOS
// ============================================

export interface CartItem {
  id: string
  productoId: string
  nombre: string
  precio: number
  cantidad: number
  imagen?: string
  farmaciaId?: string
}

export interface FarmaciaAsignada {
  id: string
  codigo: string
  nombre: string
  direccion?: string
  distancia?: number
}

interface CartState {
  items: CartItem[]
  farmaciaAsignada: FarmaciaAsignada | null
  subtotal: number
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; cantidad: number } }
  | { type: 'SET_FARMACIA'; payload: FarmaciaAsignada }
  | { type: 'CLEAR_FARMACIA' }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }

// ============================================
// ESTADO INICIAL
// ============================================

const initialState: CartState = {
  items: [],
  farmaciaAsignada: null,
  subtotal: 0,
  total: 0,
}

// ============================================
// REDUCER
// ============================================

function calculateTotals(items: CartItem[]): { subtotal: number; total: number } {
  const subtotal = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  )
  // Aquí se podrían añadir gastos de envío, descuentos, etc.
  return { subtotal, total: subtotal }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.productoId === action.payload.productoId
      )

      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Actualizar cantidad si ya existe
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, cantidad: item.cantidad + action.payload.cantidad }
            : item
        )
      } else {
        // Añadir nuevo item con ID único
        const newItem: CartItem = {
          ...action.payload,
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }
        newItems = [...state.items, newItem]
      }

      const totals = calculateTotals(newItems)

      return {
        ...state,
        items: newItems,
        ...totals,
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      const totals = calculateTotals(newItems)

      return {
        ...state,
        items: newItems,
        ...totals,
      }
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.cantidad <= 0) {
        // Si cantidad es 0 o negativa, eliminar item
        const newItems = state.items.filter(
          (item) => item.id !== action.payload.id
        )
        const totals = calculateTotals(newItems)
        return { ...state, items: newItems, ...totals }
      }

      const newItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, cantidad: action.payload.cantidad }
          : item
      )
      const totals = calculateTotals(newItems)

      return {
        ...state,
        items: newItems,
        ...totals,
      }
    }

    case 'SET_FARMACIA':
      return {
        ...state,
        farmaciaAsignada: action.payload,
      }

    case 'CLEAR_FARMACIA':
      return {
        ...state,
        farmaciaAsignada: null,
      }

    case 'CLEAR_CART':
      return initialState

    case 'LOAD_CART':
      return action.payload

    default:
      return state
  }
}

// ============================================
// CONTEXT
// ============================================

interface CartContextValue {
  state: CartState
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, cantidad: number) => void
  setFarmacia: (farmacia: FarmaciaAsignada) => void
  clearFarmacia: () => void
  clearCart: () => void
  itemCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

// ============================================
// PROVIDER
// ============================================

const CART_STORAGE_KEY = 'farmafacil_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsed })
      } catch (e) {
        console.error('Error al cargar carrito:', e)
      }
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addItem = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, cantidad: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, cantidad } })
  }

  const setFarmacia = (farmacia: FarmaciaAsignada) => {
    dispatch({ type: 'SET_FARMACIA', payload: farmacia })
  }

  const clearFarmacia = () => {
    dispatch({ type: 'CLEAR_FARMACIA' })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const itemCount = state.items.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        setFarmacia,
        clearFarmacia,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ============================================
// HOOK
// ============================================

export function useCartContext() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCartContext debe usarse dentro de CartProvider')
  }
  return context
}

