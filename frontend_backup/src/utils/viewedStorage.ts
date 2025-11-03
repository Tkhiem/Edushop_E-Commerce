import type { ViewedProductEntry } from "@/types/product";

export const getViewedProducts = (): ViewedProductEntry[] => {
  try {
    const raw = localStorage.getItem("viewed_products");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
