import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, DollarSign, Package } from "lucide-react";
import { getPurchaseHistory } from "../utils/purchaseHistory";
import type { PurchaseHistoryEntry } from "../utils/purchaseHistory";
import { formatPrice } from "../utils/currency";
import { useAuth } from "../hooks/useAuth";

const PurchaseHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [purchaseHistory, setPurchaseHistory] = useState<
    PurchaseHistoryEntry[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Simulate loading
    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      console.log(user.id);
      setPurchaseHistory(getPurchaseHistory(user.id));
      setIsLoading(false);
    }, 500);
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch sử giao dịch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Lịch sử giao dịch
          </h1>
          <p className="text-gray-600 mt-2">
            {purchaseHistory.length > 0
              ? `${purchaseHistory.length} giao dịch`
              : "Chưa có giao dịch nào"}
          </p>
        </div>

        {/* Stats Cards */}
        {purchaseHistory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Spent */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-semibold">Tổng chi tiêu</h3>
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatPrice(
                  purchaseHistory.reduce(
                    (sum, entry) => sum + entry.totalUsd,
                    0
                  )
                )}
              </p>
            </div>

            {/* Total Transactions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-semibold">Số giao dịch</h3>
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {purchaseHistory.length}
              </p>
            </div>

            {/* Last Purchase */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-semibold">
                  Giao dịch gần nhất
                </h3>
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">
                {purchaseHistory.length > 0
                  ? new Date(purchaseHistory[0].purchasedAt).toLocaleDateString(
                      "vi-VN"
                    )
                  : "—"}
              </p>
            </div>
          </div>
        )}

        {/* Purchase History List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {purchaseHistory.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Chưa có giao dịch nào
              </h3>
              <p className="text-gray-600 mb-6">
                Các khóa học bạn thanh toán sẽ hiển thị ở đây
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Khám phá khóa học
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Ngày giao dịch
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Tên khóa học
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Phương thức thanh toán
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Số tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory.map((entry, index) => (
                    <tr
                      key={`${entry.id}-${entry.purchasedAt}`}
                      className={`border-b border-gray-100 transition-colors hover:bg-slate-50 ${
                        index === 0 ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {new Date(entry.purchasedAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(entry.purchasedAt).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {entry.items.map((item) => (
                            <div
                              key={item.courseId}
                              className="text-sm text-gray-900 font-medium"
                            >
                              {item.title}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            entry.paymentMethod === "paypal"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {entry.paymentMethod === "paypal"
                            ? "PayPal"
                            : "VNPay"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(entry.totalUsd)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {purchaseHistory.length > 0 && (
          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={() => navigate("/my-courses")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Xem khóa học của tôi
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Khám phá thêm khóa học
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
