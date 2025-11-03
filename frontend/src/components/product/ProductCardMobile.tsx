import type { Product } from "@/types/product";
import React, { useState } from "react";
import { StarRating } from "../ui/StarRating";
import Text from "../ui/Text";
import Skeleton from "../ui/Skeleton";
import clsx from "clsx";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface ProductCardMobileProps {
  product?: Product;
  onDetailClick?: (product: Product) => void;
  isLiked?: boolean;
  onLikeClick?: (productId: string) => void;
  isSuggested?: boolean;
  loading?: boolean;
}

const ProductCardMobile: React.FC<ProductCardMobileProps> = ({
  product,
  onDetailClick,
  isLiked,
  onLikeClick,
  isSuggested = false,
  loading = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={clsx(
        "group relative rounded transition duration-200 cursor-pointer flex flex-col",
        loading ? "animate-pulse bg-gray-100 dark:bg-gray-800" : ""
      )}
    >
      {isSuggested && !loading && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-semibold px-2 py-1 rounded shadow">
          Đề xuất
        </div>
      )}

      {/* Yêu thích */}
      {!loading && onLikeClick && product && (
        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onLikeClick(product.id);
          }}
          className="absolute top-2 right-2 rounded-full p-1 bg-white shadow"
          title={isLiked ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
          {isLiked || isHovered ? (
            <FaHeart className="text-red-600 transition" />
          ) : (
            <FaRegHeart className="text-gray-600 transition" />
          )}
        </button>
      )}

      {/* Image */}
      <div
        className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-t overflow-hidden"
        onClick={() => product && onDetailClick?.(product)}
      >
        {!loading && product?.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div
        className="flex flex-col flex-1 py-2"
        onClick={() => product && onDetailClick?.(product)}
      >
        <h3
          className="text-base font-semibold truncate h-6 dark:text-white"
          title={product?.name}
        >
          {loading ? <Skeleton width="w-3/4" height="h-6" /> : product?.name}
        </h3>

        <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[40px]">
          {loading ? (
            <>
              <Skeleton />
              <Skeleton width="w-2/3" />
            </>
          ) : (
            <Text
              text={product?.description || ""}
              className="text-gray-500 dark:text-gray-400"
            />
          )}
        </div>

        <div className="mt-1">
          {loading ? (
            <Skeleton width="w-24" height="h-5" />
          ) : (
            product && (
              <StarRating
                rating={product.rating}
                countRating={product.countRating}
              />
            )
          )}
        </div>

        <div className="relative">
          {loading ? (
            <Skeleton width="w-20" height="h-4" />
          ) : (
            <p className="font-bold text-primary tracking-tight z-0 relative flex items-end gap-2 whitespace-nowrap">
              {product?.price.toLocaleString()} VNĐ
              {product && product.originalPrice > product.price && (
                <span className="text-[14px] text-gray-500 dark:text-gray-400 line-through font-normal whitespace-nowrap">
                  {product.originalPrice.toLocaleString()} VNĐ
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCardMobile;
