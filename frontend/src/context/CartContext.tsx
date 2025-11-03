import { createContext } from "react";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
