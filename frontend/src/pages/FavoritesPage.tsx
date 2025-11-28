import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";

// ✅ CORRECT IMPORT
import { useFavorites } from "../hooks/useFavorites";

const FavoritesPage: React.FC = () => {
  const { favorites, clearFavorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No favorites yet
          </h2>
          <p className="text-gray-600 mb-8">
            Start adding courses to your favorites to see them here.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-gray-600 mt-2">
            {favorites.length} {favorites.length === 1 ? "course" : "courses"}
          </p>
        </div>
        <button
          onClick={clearFavorites}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
