// components/cart/CartItem.tsx
import React from "react";
import { type Product } from "@/types/product";
import { StarRating } from "../ui/StarRating";
import { IoMdPricetag } from "react-icons/io";
import { GoTrash } from "react-icons/go";
import Skeleton from "../ui/Skeleton";

interface CartItemProps {
  product?: Product;
  onRemove?: (productId: string) => void;
  loading?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({ product, onRemove, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-between border-t border-gray-300 pt-4">
        <div className="flex gap-4">
          <Skeleton className="w-24 h-24 rounded" />
          <div className="flex flex-col justify-between">
            <Skeleton width="w-32" height="h-5" />
            <Skeleton width="w-20" />
            <Skeleton width="w-36" />
          </div>
        </div>
        <div className="text-right">
          <Skeleton width="w-20" />
          <Skeleton width="w-12" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="flex justify-between border-t border-gray-300 dark:border-gray-600 pt-4">
      <div className="flex gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-24 h-24 md:w-32 md:h-20 object-cover rounded"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="font-semibold line-clamp-2 dark:text-gray-100">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bởi {product.instructor}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {product.rating >= 4.8 && (
                <span className="hidden md:block bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-semibold rounded">
                  Xếp hạng cao nhất
                </span>
              )}
              <StarRating rating={product.rating} />
              <span className="text-xs text-gray-500 whitespace-nowrap dark:text-gray-300">
                ({product.countRating}
                <span className="hidden md:inline">&nbsp;xếp hạng</span>)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-right flex flex-col justify-between items-end">
        <div>
          <p className="text-primary font-semibold md:text-lg flex items-center gap-1 whitespace-nowrap">
            {product.price.toLocaleString()} VNĐ
            <IoMdPricetag className="transform scale-x-[-1]" />
          </p>
          <p className="text-gray-400 line-through text-sm font-extralight">
            {product.originalPrice.toLocaleString()} VNĐ
          </p>
        </div>

        <button
          onClick={() => onRemove?.(product.id)}
          className="text-primary hover:underline text-md"
        >
          <GoTrash className="hover:text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
