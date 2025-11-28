import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { useCart } from "../hooks/useCart";
import {
  addPurchaseHistory,
  clearPendingPurchase,
  getPendingPurchase,
  type PurchaseHistoryEntry,
} from "../utils/purchaseHistory";
import { formatPrice } from "../utils/currency";

const statusMessages: Record<
  string,
  { title: string; description: string; color: string }
> = {
  loading: {
    title: "Đang xác nhận thanh toán...",
    description: "Vui lòng chờ trong giây lát.",
    color: "text-gray-600",
  },
  success: {
    title: "Thanh toán thành công!",
    description: "Khóa học sẽ được mở khóa ngay lập tức.",
    color: "text-green-600",
  },
  failed: {
    title: "Thanh toán chưa hoàn tất",
    description: "Vui lòng thử lại hoặc chọn phương thức khác.",
    color: "text-red-600",
  },
};

const VnPayReturnPage: React.FC = () => {
  // console.log('qq gì vậy')
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState<string>("");

//   const queryRef = React.useRef(location.search);
// const queryString = queryRef.current;
const queryString = useMemo(() => location.search || "", [location.search]);


  useEffect(() => {
    const finalizePayment = async () => {
      try {
        if (!queryString) {
          setStatus("failed");
          setMessage("Thiếu tham số phản hồi từ VNPay.");
          return;
        }

        const verifyRes = await axios.get(`/orders/vnpay/verify${queryString}`);
        console.log("verifyRes: ",verifyRes);
        if (!verifyRes.data?.success) {
          setStatus("failed");
          setMessage(
            verifyRes.data?.message || "VNPay chưa xác nhận giao dịch."
          );
          return;
        }

        const vnpData = verifyRes.data?.data;
        const orderId = vnpData?.vnp_TxnRef;
        if (!orderId) {
          setStatus("failed");
          setMessage("Không tìm thấy mã giao dịch VNPay.");
          return;
        }

        const pending = getPendingPurchase();
        if (!pending) {
          setStatus("failed");
          setMessage("Không tìm thấy dữ liệu giỏ hàng để hoàn tất đơn.");
          return;
        }

        const completeRes = await axios.post("/orders/complete", {
          orderId,
          paymentReference: orderId,
          paymentMethod: "vnpay",
          currency: pending.currency,
          total: pending.totalUsd,
          cartItems: pending.cartItems,
          vnpayData: vnpData,
          transactionId: vnpData?.vnp_TransactionNo,
        });

        const historyEntry: PurchaseHistoryEntry = {
          id: completeRes.data?.data?.order?._id || orderId,
          totalUsd: pending.totalUsd,
          totalVnd: pending.totalVnd,
          currency: pending.currency,
          paymentMethod: "vnpay",
          purchasedAt: new Date().toISOString(),
          items: pending.cartItems,
        };
        addPurchaseHistory(historyEntry);
        clearPendingPurchase();
        fetchCart();
        setStatus("success");
        setMessage("Bạn sẽ được chuyển tới trang Khóa học trong giây lát.");
        setTimeout(() => navigate("/my-courses"), 5000);
      } catch (error) {
        console.error("VNPay finalize error:", error);
        setStatus("failed");
        setMessage("Không thể xác nhận thanh toán VNPay.");
        clearPendingPurchase();
      }
    };

    finalizePayment();
  }, [queryString]);

  const statusContent = statusMessages[status];
  const pending = getPendingPurchase();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center space-y-4">
        <h1 className={`text-2xl font-bold ${statusContent.color}`}>
          {statusContent.title}
        </h1>
        <p className="text-gray-600">{statusContent.description}</p>
        {message && <p className="text-sm text-gray-500">{message}</p>}

        {pending && (
          <div className="mt-6 border rounded-xl p-4 bg-slate-50 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Số tiền</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(pending.totalUsd)}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Khóa học</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {pending.cartItems.map((item) => (
                  <li key={item.courseId}>{item.title}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {status === "failed" && (
          <button
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => navigate("/cart")}
          >
            Quay lại giỏ hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default VnPayReturnPage;

