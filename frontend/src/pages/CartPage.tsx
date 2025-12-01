import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { ShoppingCart, ArrowLeft, LogIn } from "lucide-react";
import Checkout from "../components/orders/Checkout";
import { getPurchaseHistory } from "../utils/purchaseHistory";
import type { PurchaseHistoryEntry } from "../utils/purchaseHistory";
import { formatPrice } from "../utils/currency";
const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
    fetchCart,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  // const [purchaseHistory, setPurchaseHistory] = useState<
  //   PurchaseHistoryEntry[]
  // >([]);

  // ✅ Calculate totals (backend prices are in USD)
  const { subtotal, total } = useMemo(() => {
    const subtotalUsd = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // No discount for now, total = subtotal
    const totalUsd = subtotalUsd;

    return {
      subtotal: subtotalUsd, // Keep in USD for CartSummary
      total: totalUsd,
    };
  }, [cart]);

  // useEffect(() => {
  //   setPurchaseHistory(getPurchaseHistory());
  // }, []);

  // const refreshPurchaseHistory = () => {
  //   setPurchaseHistory(getPurchaseHistory());
  // };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    fetchCart();
    setShowCheckout(false);
    // refreshPurchaseHistory();
    navigate("/my-courses");
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <LogIn className="w-24 h-24 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Vui lòng đăng nhập
          </h2>
          <p className="text-gray-600 mb-8">
            Bạn cần đăng nhập để xem giỏ hàng
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-8">
            Bạn chưa có khóa học nào trong giỏ hàng
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Khám phá khóa học
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Tiếp tục mua sắm</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
          <p className="text-gray-600 mt-2">
            {cart.length} khóa học trong giỏ hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <CartItem
                key={String(item.id || item._id || index)}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="w-full py-3 text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-colors font-semibold"
            >
              Xóa toàn bộ giỏ hàng
            </button>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1 space-y-6">
            <CartSummary
              subtotal={subtotal}
              discount={0}
              total={total}
              itemCount={cart.length}
              onCheckout={handleCheckout}
            />
            {/* PayPal checkout area */}
            {/* <div className="mt-2">
              <Checkout amount={total.toFixed(2)} />
            </div> */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Lịch sử mua gần đây
                </h3>
                <span className="text-xs text-gray-500">
                  {purchaseHistory.length > 0
                    ? `${purchaseHistory.length} giao dịch`
                    : "Chưa có dữ liệu"}
                </span>
              </div>
              {purchaseHistory.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Các khóa học đã thanh toán sẽ hiển thị tại đây.
                </p>
              ) : (
                <ul className="space-y-4">
                  {purchaseHistory.slice(0, 5).map((entry) => (
                    <li
                      key={`${entry.id}-${entry.purchasedAt}`}
                      className="border-t border-gray-100 pt-3 first:border-t-0 first:pt-0"
                    >
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          {new Date(entry.purchasedAt).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(entry.totalUsd)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 capitalize">
                        Phương thức:{" "}
                        {entry.paymentMethod === "paypal" ? "PayPal" : "VNPay"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {entry.items.map((item) => item.title).join(", ")}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div> */}
          </div>
        </div>
      </div>
      {/* Checkout modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            {/* <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close checkout"
              >
                ✕
              </button>
            </div> */}
            <Checkout
              amount={total.toFixed(2)}
              items={cart}
              currency="USD"
              onClose={() => setShowCheckout(false)}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
