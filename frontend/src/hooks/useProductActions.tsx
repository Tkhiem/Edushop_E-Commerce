// hooks/useProductActions.tsx
import { useFavorites } from "@/hooks/useFavorites";
import { useViewedProducts } from "@/hooks/useViewedProducts";
import { IoMdHeart, IoMdHeartDislike } from "react-icons/io";
import { toast } from "sonner";
import type { Product } from "@/types/product";
import { useState } from "react";

export const useProductActions = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addViewedProduct } = useViewedProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleToggleFavorite = (productId: string) => {
    const alreadyLiked = isFavorite(productId);
    toggleFavorite(productId);
    const icon = alreadyLiked ? (
      <IoMdHeartDislike className="text-gray-400 w-5 h-5" />
    ) : (
      <IoMdHeart className="text-red-600 w-5 h-5" />
    );

    toast.success(
      alreadyLiked
        ? "Đã bỏ yêu thích sản phẩm"
        : "Đã thêm sản phẩm vào yêu thích",
      {
        icon,
      }
    );
  };

  const handleViewDetail = (product: Product) => {
    addViewedProduct(product);
    setSelectedProduct(product);
  };

  return {
    selectedProduct,
    setSelectedProduct,
    handleToggleFavorite,
    handleViewDetail,
    isFavorite,
  };
};
