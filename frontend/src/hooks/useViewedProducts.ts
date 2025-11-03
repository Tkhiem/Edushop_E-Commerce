import { useEffect, useState } from "react";
import type { Product, ViewedProductEntry } from "@/types/product";

const STORAGE_KEY = "viewed_products";

export const useViewedProducts = () => {
  const [viewed, setViewed] = useState<ViewedProductEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ViewedProductEntry[];
        setViewed(parsed);
      } catch (e) {
        console.error("Failed to parse viewed products", e);
      }
    }
  }, []);

  const addViewedProduct = (product: Product) => {
    const now = new Date().toISOString();

    setViewed((prev) => {
      const index = prev.findIndex((entry) => entry.product.id === product.id);

      let updated: ViewedProductEntry[];

      if (index !== -1) {
        const entry = prev[index];
        const newEntry: ViewedProductEntry = {
          ...entry,
          viewedTimes: entry.viewedTimes + 1,
          lastViewedAt: now,
          history: [...entry.history, now],
        };
        updated = [newEntry, ...prev.filter((_, i) => i !== index)];
      } else {
        const newEntry: ViewedProductEntry = {
          product,
          viewedTimes: 1,
          lastViewedAt: now,
          history: [now],
        };
        updated = [newEntry, ...prev];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 100)));
      return updated.slice(0, 100);
    });
  };

  const clearViewed = () => {
    localStorage.removeItem(STORAGE_KEY);
    setViewed([]);
  };

  return { viewed, addViewedProduct, clearViewed };
};
