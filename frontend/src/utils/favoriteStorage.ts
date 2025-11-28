import { Product } from "../types/product";

const FAVORITES_KEY = "edushop_favorites";

/**
 * Get all favorites from localStorage
 */
export const getFavorites = (): Product[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];

    const favorites = JSON.parse(stored);
    return Array.isArray(favorites) ? favorites : [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
};

/**
 * Add product to favorites
 */
export const addToFavorites = (product: Product): void => {
  try {
    const favorites = getFavorites();
    const productId = product.id || product._id;

    if (!productId) {
      console.error("Cannot add to favorites: Product ID is missing", product);
      return;
    }

    // Check if already exists
    const exists = favorites.some((fav) => {
      const favId = fav.id || fav._id;
      return favId === productId;
    });

    if (!exists) {
      const newFavorites = [...favorites, product];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      console.log("✅ Added to favorites:", product.title);
    } else {
      console.log("ℹ️ Already in favorites:", product.title);
    }
  } catch (error) {
    console.error("Error adding to favorites:", error);
  }
};

/**
 * Remove product from favorites
 */
export const removeFromFavorites = (productId: string): void => {
  try {
    if (!productId) {
      console.error("Cannot remove from favorites: Product ID is missing");
      return;
    }

    const favorites = getFavorites();
    const newFavorites = favorites.filter((fav) => {
      const favId = fav.id || fav._id;
      return favId !== productId;
    });

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    console.log("✅ Removed from favorites:", productId);
  } catch (error) {
    console.error("Error removing from favorites:", error);
  }
};

/**
 * Check if product is in favorites
 */
export const isInFavorites = (productId: string): boolean => {
  try {
    if (!productId) return false;

    const favorites = getFavorites();
    return favorites.some((fav) => {
      const favId = fav.id || fav._id;
      return favId === productId;
    });
  } catch (error) {
    console.error("Error checking favorites:", error);
    return false;
  }
};

/**
 * Clear all favorites
 */
export const clearFavorites = (): void => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    console.log("✅ Cleared all favorites");
  } catch (error) {
    console.error("Error clearing favorites:", error);
  }
};

/**
 * Get favorites count
 */
export const getFavoritesCount = (): number => {
  try {
    return getFavorites().length;
  } catch (error) {
    console.error("Error getting favorites count:", error);
    return 0;
  }
};

/**
 * Toggle favorite (add if not exists, remove if exists)
 */
export const toggleFavorite = (product: Product): boolean => {
  try {
    const productId = product.id || product._id;

    if (!productId) {
      console.error("Cannot toggle favorite: Product ID is missing", product);
      return false;
    }

    const isFavorited = isInFavorites(productId);

    if (isFavorited) {
      removeFromFavorites(productId);
      return false; // Removed
    } else {
      addToFavorites(product);
      return true; // Added
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return false;
  }
};
