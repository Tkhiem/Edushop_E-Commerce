import { createContext } from "react";

type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);
