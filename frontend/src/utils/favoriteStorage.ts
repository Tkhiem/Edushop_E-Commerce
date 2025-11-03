import { mockProducts } from "@/data/products";
import type { Product } from "@/types/product";

export const getFavorites = (): Product[] => {
  try {
    const raw = localStorage.getItem("favorites");
    const ids: string[] = raw ? JSON.parse(raw) : [];
    return mockProducts.filter((p) => ids.includes(p.id));
  } catch {
    return [];
  }
};
