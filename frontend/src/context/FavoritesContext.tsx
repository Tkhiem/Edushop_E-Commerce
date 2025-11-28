import { createContext } from "react";
import { Product } from "../types/product";

export interface FavoritesContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);