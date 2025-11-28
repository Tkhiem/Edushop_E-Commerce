import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    // Return safe defaults instead of throwing
    console.warn("useFavorites must be used within FavoritesProvider");
    return {
      favorites: [],
      toggleFavorite: () => {},
      isFavorite: () => false,
      clearFavorites: () => {},
    };
  }

  return context;
};
