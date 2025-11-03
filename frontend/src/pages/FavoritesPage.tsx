// src/pages/FavoritesPage.tsx
import React, { useEffect, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { mockProducts } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import ProductListCard from "@/components/product/ProductListCard";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import EmptyState from "@/components/EmptyState";
import emptyFavoriteSVG from "@/assets/favorite.svg";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import clsx from "clsx";
import ProductDetailModal from "@/components/product/ProductDetailModal";
import { IoMdHeart, IoMdHeartDislike } from "react-icons/io";
import { toast } from "sonner";
import type { Product } from "@/types/product";
import { useViewedProducts } from "@/hooks/useViewedProducts";

const FavoritesPage: React.FC = () => {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const isMobile = useBreakpoint() === "mobile";

  const favoriteProducts = mockProducts.filter((p) => favorites.includes(p.id));
  const { addViewedProduct } = useViewedProducts();
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleToggleFavorite = (productId: string) => {
    const alreadyLiked = isFavorite(productId);
    toggleFavorite(productId);
    toast.success(
      alreadyLiked
        ? "Đã bỏ yêu thích sản phẩm"
        : "Đã thêm sản phẩm vào yêu thích",
      {
        icon: alreadyLiked ? (
          <IoMdHeartDislike className="text-gray-400 w-5 h-5" />
        ) : (
          <IoMdHeart className="text-red-600 w-5 h-5" />
        ),
      }
    );
  };

  const handleViewDetail = (product: Product) => {
    addViewedProduct(product);
    setSelectedProduct(product);
  };

  return (
    <div className="container mx-auto md:px-4 md:py-6">
      {favoriteProducts.length > 0 && (
        <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">
          Sản phẩm yêu thích
        </h1>
      )}

      {favoriteProducts.length === 0 ? (
        <EmptyState
          imageSrc={emptyFavoriteSVG}
          description="Bạn chưa yêu thích sản phẩm nào."
          cta={
            <Link to="/">
              <Button variant="primary">Lướt để khám phá</Button>
            </Link>
          }
        />
      ) : loading ? (
        <div
          className={clsx({
            "grid grid-cols-2 lg:grid-cols-3 gap-6": !isMobile,
            "space-y-2 flex flex-col": isMobile,
          })}
        >
          {Array.from({ length: 6 }).map((_, i) =>
            !isMobile ? (
              <ProductCard key={i} loading />
            ) : (
              <ProductListCard key={i} loading />
            )
          )}
        </div>
      ) : isMobile ? (
        <div className="space-y-4">
          {favoriteProducts.map((product) => (
            <ProductListCard
              key={product.id}
              product={product}
              isLiked={isFavorite(product.id)}
              onLikeClick={() => toggleFavorite(product.id)}
              onDetailClick={handleViewDetail}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isLiked={isFavorite(product.id)}
              onLikeClick={() => toggleFavorite(product.id)}
              onDetailClick={handleViewDetail}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          isLiked={isFavorite(selectedProduct.id)}
          onLikeClick={handleToggleFavorite}
        />
      )}
    </div>
  );
};

export default FavoritesPage;
