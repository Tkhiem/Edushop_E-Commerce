import type { Product } from "@/types/product";
import React from "react";
import { MdChevronRight } from "react-icons/md";
import { StarRating } from "../ui/StarRating";
import Text from "../ui/Text";
import Skeleton from "../ui/Skeleton";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import clsx from "clsx";

interface ProductListCardProps {
  product?: Product;
  onDetailClick?: (product: Product) => void;
  isLiked?: boolean;
  onLikeClick?: (productId: string) => void;
  loading?: boolean;
}

const ProductListCard: React.FC<ProductListCardProps> = ({
  product,
  onDetailClick,
  isLiked,
  onLikeClick,
  loading = false,
}) => {
  const location = useLocation();
  const isHistoryPage = location.pathname === "/history";
  return (
    <div className="flex relative gap-4 py-3 border-b border-gray-300 md:mx-3 mx-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition items-center">
      {/* Image */}
      <div
        className="w-24 h-24 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0"
        onClick={() => product && onDetailClick?.(product)}
      >
        {loading ? (
          <Skeleton width="w-24" height="h-24" />
        ) : (
          <img
            src={product?.image}
            alt={product?.name}
            className="w-full h-full object-cover rounded"
          />
        )}
      </div>

      {!loading && onLikeClick && product && (
        <button
          onClick={() => onLikeClick(product.id)}
          className="absolute top-3 right-2"
          title={isLiked ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
          {isLiked ? <FaHeart className="text-red-600" /> : <FaRegHeart />}
        </button>
      )}

      {/* Content */}
      <div
        className="flex flex-col justify-between flex-1"
        onClick={() => product && onDetailClick?.(product)}
      >
        <div>
          <h3 className="text-base font-semibold leading-tight line-clamp-1 pr-6 dark:text-gray-100">
            {loading ? <Skeleton width="w-3/4" height="h-5" /> : product?.name}
          </h3>

          <div className="mt-0.5">
            {loading ? (
              <>
                <Skeleton />
                <Skeleton width="w-2/3" />
              </>
            ) : (
              <Text
                text={product?.description || ""}
                className="text-sm text-gray-600 line-clamp-2 dark:text-gray-400"
              />
            )}
          </div>

          <div className="mt-0.5">
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
        </div>

        <div
          className={clsx("pt-1", {
            "flex justify-between items-center": true,
          })}
        >
          <div
            className={clsx({
              "flex items-center gap-2": isHistoryPage,
            })}
          >
            {loading ? (
              <Skeleton width="w-20" height="h-4" />
            ) : (
              <p className="text-primary font-bold text-sm whitespace-nowrap">
                {product?.price.toLocaleString()} VNĐ
              </p>
            )}

            {loading ? (
              <Skeleton width="w-16" height="h-4 mt-1" />
            ) : (
              product &&
              product.originalPrice > product.price &&
              (isHistoryPage ? (
                <p className="text-[12px] text-gray-500 line-through font-normal whitespace-nowrap">
                  {product.originalPrice.toLocaleString()} VNĐ
                </p>
              ) : (
                <p className="text-[12px] text-gray-500 line-through font-normal whitespace-nowrap mt-1">
                  {product.originalPrice.toLocaleString()} VNĐ
                </p>
              ))
            )}
          </div>

          {/* Xem chi tiết */}
          {!loading && !isHistoryPage && (
            <div
              onClick={() => product && onDetailClick?.(product)}
              className="flex items-center text-sm text-primary font-medium cursor-pointer hover:text-primary-hover"
            >
              <span>Xem chi tiết</span>
              <MdChevronRight className="w-4 h-4 ml-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListCard;
