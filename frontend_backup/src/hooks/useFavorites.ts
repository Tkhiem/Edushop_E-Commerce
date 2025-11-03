// import { useEffect, useState } from "react";

import { FavoritesContext } from "@/context/FavoritesContext";
import { useContext } from "react";

// export const useFavorites = () => {
//   const [favorites, setFavorites] = useState<string[]>(() => {
//     const stored = localStorage.getItem("favorites");
//     return stored ? JSON.parse(stored) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem("favorites", JSON.stringify(favorites));
//   }, [favorites]);

//   const toggleFavorite = (id: string) => {
//     setFavorites((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const isFavorite = (id: string) => favorites.includes(id);

//   return { favorites, toggleFavorite, isFavorite };
// };
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
