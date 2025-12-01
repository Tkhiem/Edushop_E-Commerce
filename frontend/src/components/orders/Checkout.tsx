import React, { useEffect, useMemo, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "../../api/axiosConfig";
import type { CartItem } from "../../types/cart";
import { convertUsdToVnd, formatPrice } from "../../utils/currency";
import {
  addPurchaseHistory,
  mapCartItemsToHistory,
  savePendingPurchase,
} from "../../utils/purchaseHistory";

interface CheckoutProps {
  amount?: string;
  items?: CartItem[];
  currency?: string;
  onClose?: () => void;
  onSuccess?: (payload: any) => void;
}

const Checkout: React.FC<CheckoutProps> = ({
  amount: initialAmount = "5.00",
  items = [],
  currency = "USD",
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "vnpay">(
    "paypal"
  );
  const SERVER =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/orders";

  // Use axios instance (`/api` base handled by `src/api/axiosConfig.ts`).

  useEffect(() => {
    setAmount(initialAmount);
  }, [initialAmount]);

  const numericAmount = parseFloat(amount);
  const validAmount =
    !isNaN(numericAmount) && numericAmount > 0 && items.length > 0;

  const normalizedItems = useMemo(() => mapCartItemsToHistory(items), [items]);

  const displayAmount = Number.isFinite(numericAmount)
    ? formatPrice(numericAmount)
    : "0 ₫";
  const usdDisplay = Number.isFinite(numericAmount)
    ? numericAmount.toFixed(2)
    : "0.00";
  const amountVnd =
    Number.isFinite(numericAmount) && numericAmount > 0
      ? convertUsdToVnd(numericAmount)
      : 0;

  const handleVnPayCheckout = async () => {
    try {
      setIsProcessing(true);
      setMessage("Đang chuyển tới VNPay...");
      savePendingPurchase({
        cartItems: normalizedItems,
        totalUsd: numericAmount,
        totalVnd: amountVnd,
        currency,
        paymentMethod: "vnpay",
        createdAt: new Date().toISOString(),
      });
      const response = await axios.post("/orders/vnpay/create-payment", {
        amountUsd: numericAmount.toFixed(2),
        amountVnd,
      });
      const paymentUrl =
        response.data?.data?.paymentUrl || response.data?.paymentUrl;
      if (!paymentUrl) {
        throw new Error("Không nhận được liên kết thanh toán VNPay");
      }
      console.log("pay", paymentUrl);
      window.location.href = paymentUrl;
    } catch (error) {
      console.error(error);
      setMessage("Không thể khởi tạo thanh toán VNPay");
    } finally {
      setIsProcessing(false);
    }
  };

  const recordPurchaseHistory = (
    method: "paypal" | "vnpay",
    referenceId?: string
  ) => {
    if (!numericAmount || numericAmount <= 0) return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    addPurchaseHistory({
      id: referenceId || `${method}-${Date.now()}`,
      userId: user.id,
      totalUsd: numericAmount,
      totalVnd: amountVnd,
      currency,
      paymentMethod: method,
      purchasedAt: new Date().toISOString(),
      items: normalizedItems,
    });
  };

  return (
    <div style={{ maxWidth: 520 }}>
      {onClose && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}

      <label style={{ display: "block" }}>
        Tổng tiền (VND):{" "}
        <input
          value={displayAmount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: 6, marginLeft: 8, width: "60%" }}
          readOnly
        />
      </label>
      <small style={{ color: "#64748b" }}>
        Quy đổi từ {usdDisplay} {currency}
      </small>

      <div style={{ marginTop: 16 }}>
        {!validAmount ? (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: "#fff4f4",
              color: "#a00",
            }}
          >
            {items.length === 0
              ? "Không có khóa học nào để thanh toán."
              : "Tổng tiền phải lớn hơn 0 để thanh toán."}
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 600, marginBottom: 8 }}>
                Chọn phương thức thanh toán
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {["paypal", "vnpay"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() =>
                      setPaymentMethod(method as "paypal" | "vnpay")
                    }
                    className="flex-1 border rounded-lg py-2 px-3 text-sm font-semibold transition-colors"
                    style={{
                      borderColor:
                        paymentMethod === method ? "#2563eb" : "#e2e8f0",
                      color: paymentMethod === method ? "#1d4ed8" : "#475569",
                      background: paymentMethod === method ? "#eff6ff" : "#fff",
                    }}
                    disabled={isProcessing}
                  >
                    {method === "paypal" ? "PayPal" : "VNPay"}
                  </button>
                ))}
              </div>
            </div>
            {paymentMethod === "paypal" ? (
              <PayPalButtons
                style={{ layout: "vertical" }}
                disabled={isProcessing}
                createOrder={async () => {
                  try {
                    setMessage("Tạo order PayPal...");
                    const res = await fetch(`${SERVER}/create-order`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        amount: numericAmount.toFixed(2),
                        currency,
                      }),
                    });
                    const dataJson = await res.json();
                    const orderId =
                      dataJson.orderId ?? dataJson.id ?? dataJson.data?.id;
                    if (!orderId)
                      throw new Error("Không nhận được orderId từ server");
                    return orderId;
                  } catch (err) {
                    console.error(err);
                    setMessage("Lỗi khi tạo order PayPal");
                    throw err;
                  }
                }}
                onApprove={async (data) => {
                  try {
                    setMessage("Xác nhận thanh toán PayPal...");
                    setIsProcessing(true);
                    const orderId = data.orderID || (data as any).orderId;
                    const res = await fetch(
                      `${SERVER}/capture-order/${orderId}`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderId }),
                      }
                    );
                    const details = await res.json();
                    setMessage("Hoàn tất đơn hàng...");

                    const completeRes = await axios.post("/orders/complete", {
                      orderId,
                      currency,
                      total: numericAmount,
                      cartItems: normalizedItems,
                      paypalData: details?.data ?? details,
                      paymentMethod: "paypal",
                      paymentReference: orderId,
                    });

                    recordPurchaseHistory("paypal", orderId);

                    setMessage(
                      "Thanh toán thành công! Khóa học đã được mở khóa."
                    );
                    onSuccess?.(completeRes.data?.data);
                    alert(
                      "Thanh toán thành công! Bạn có thể học ngay khóa học."
                    );
                    if (onClose) onClose();
                  } catch (err) {
                    console.error(err);
                    setMessage("Lỗi khi xác nhận thanh toán PayPal");
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                onError={(err) => {
                  console.error(err);
                  setMessage("Lỗi thanh toán PayPal");
                  setIsProcessing(false);
                }}
              />
            ) : (
              <button
                type="button"
                onClick={handleVnPayCheckout}
                disabled={isProcessing}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  opacity: isProcessing ? 0.6 : 1,
                }}
              >
                {isProcessing ? "Đang xử lý..." : "Thanh toán với VNPay"}
              </button>
            )}
          </>
        )}
      </div>
      <div style={{ marginTop: 12 }}>
        <small>{message}</small>
      </div>
    </div>
  );
};

export default Checkout;
