// utils/cartStorage.ts
import type { CartItem } from "@/types/cart";

const STORAGE_KEY = "cart_items";

export function getCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
