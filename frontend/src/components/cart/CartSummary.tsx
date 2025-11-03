// components/cart/CartSummary.tsx
import React from "react";
import Button from "../ui/Button";
import { FiArrowRight } from "react-icons/fi";
import Skeleton from "../ui/Skeleton";

interface CartSummaryProps {
  total?: number;
  originalTotal?: number;
  discountPercentage?: number;
  loading?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  total,
  originalTotal,
  discountPercentage,
  loading,
}) => {
  return (
    <div className="md:static fixed bottom-0 left-0 right-0 z-50 bg-white p-4 rounded-t-2xl md:shadow-none md:rounded-none md:p-4 dark:bg-gray-800">
      <p className="text-lg font-semibold mb-1 text-gray-600 dark:text-gray-200">
        Tổng:
      </p>

      {loading ? (
        <>
          <Skeleton width="w-32" height="h-8" />
          <Skeleton width="w-24" />
          <Skeleton width="w-32" />
          <Skeleton height="h-12" className="w-full mt-4" />
        </>
      ) : (
        <>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {total?.toLocaleString()} đ
          </p>
          <p className="text-sm text-gray-400 line-through">
            {originalTotal?.toLocaleString()} đ
          </p>
          <p className="text-green-600 font-medium mb-4">
            Giảm {discountPercentage}%
          </p>
          <Button
            className="w-full py-3 font-bold"
            iconRight={<FiArrowRight className="w-5 h-5" />}
          >
            Tiến hành thanh toán
          </Button>
        </>
      )}
    </div>
  );
};

export default CartSummary;
