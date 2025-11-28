import React, { useState, useEffect, useCallback } from "react";
import { FavoritesContext } from "./FavoritesContext";
import { Product } from "../types/product";
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  clearFavorites as clearFavoritesStorage,
} from "../utils/favoriteStorage";

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadedFavorites = getFavorites();
    setFavorites(loadedFavorites);
    console.log("📦 Loaded favorites:", loadedFavorites.length);
  }, []);

  // Check if product is in favorites
  const isFavorite = useCallback(
    (productId: string): boolean => {
      if (!productId) return false;

      const normalizedId = productId.trim();

      const result = favorites.some((fav) => {
        const favId = (fav.id || fav._id || "").trim();
        return favId === normalizedId;
      });

      return result;
    },
    [favorites]
  );

  // Toggle favorite
  const toggleFavorite = useCallback((product: Product) => {
    const productId = product.id || product._id;

    if (!productId) {
      console.error("❌ Product ID is missing:", product);
      return;
    }

    setFavorites((prevFavorites) => {
      const isCurrentlyFavorite = prevFavorites.some(
        (fav) => (fav.id || fav._id) === productId
      );

      let newFavorites: Product[];

      if (isCurrentlyFavorite) {
        // Remove from favorites
        newFavorites = prevFavorites.filter(
          (fav) => (fav.id || fav._id) !== productId
        );
        removeFromFavorites(productId);
        console.log("💔 Removed from favorites:", product.title);
      } else {
        // Add to favorites
        newFavorites = [...prevFavorites, product];
        addToFavorites(product);
        console.log("❤️ Added to favorites:", product.title);
      }

      return newFavorites;
    });
  }, []);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    clearFavoritesStorage();
    console.log("🗑️ Cleared all favorites");
  }, []);

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
