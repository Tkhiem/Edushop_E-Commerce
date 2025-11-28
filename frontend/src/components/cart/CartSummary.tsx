import React from "react";
import { ShoppingCart, Tag, CreditCard } from "lucide-react";
import { formatPrice } from "../../utils/currency";
interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  total: number;
  itemCount: number;
  onCheckout: () => void;
  isLoading?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  discount = 0,
  total,
  itemCount,
  onCheckout,
  isLoading = false,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ShoppingCart className="w-6 h-6 text-blue-600" />
        Tóm tắt đơn hàng
      </h2>
      <div className="space-y-4 mb-6">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-gray-600">
          <span>Tạm tính ({itemCount} sản phẩm)</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Giảm giá
            </span>
            <span className="font-semibold">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">
              Tổng cộng
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={isLoading || itemCount === 0}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        {isLoading ? "Đang xử lý..." : "Thanh toán"}
      </button>
      {/* Security Notice */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          🔒 Thanh toán an toàn & bảo mật
        </p>
      </div>
    </div>
  );
};

export default CartSummary;
