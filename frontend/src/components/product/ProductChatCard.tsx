import React from "react";
import type { Product } from "@/types/product";

interface Props {
  product: Product;
  onClick: () => void;
}

const ProductChatCard: React.FC<Props> = ({ product, onClick }) => {
  return (
    <div
      className="group mt-2 rounded-lg p-3 bg-white shadow-sm w-full max-w-xs transition-transform duration-200 hover:scale-105 hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-3 items-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-14 h-14 object-cover rounded"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h4>
          <div className="text-primary font-medium text-sm">
            {product.price.toLocaleString("vi-VN")} VNĐ
          </div>
        </div>
      </div>
      <p className="text-xs mt-1 text-gray-500 line-clamp-2">
        {product.description}
      </p>
      {/* <div className="text-sm text-primary underline mt-1">Xem chi tiết</div> */}
    </div>
  );
};

export default ProductChatCard;
