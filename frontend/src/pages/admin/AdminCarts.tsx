import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { ShoppingCart, Search, Trash2, User, BookOpen } from "lucide-react";
import axios from "../../api/axiosConfig";

interface CartItem {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  course: {
    _id: string;
    title: string;
    price: number;
    imageUrl?: string;
  };
  addedAt: string;
}

const AdminCarts: React.FC = () => {
  const { isAdmin } = useAuth();
  const [carts, setCarts] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      setLoading(true);
      // Note: Backend needs GET /api/carts/admin/all endpoint
      // For now using mock data
      const mockCarts: CartItem[] = [
        {
          _id: "cart1",
          user: {
            _id: "user1",
            fullName: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
          },
          course: {
            _id: "course1",
            title: "Complete Web Development Bootcamp",
            price: 99.99,
            imageUrl: "https://via.placeholder.com/150",
          },
          addedAt: "2024-01-15T10:30:00Z",
        },
        {
          _id: "cart2",
          user: {
            _id: "user1",
            fullName: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
          },
          course: {
            _id: "course2",
            title: "Python for Data Science",
            price: 79.99,
            imageUrl: "https://via.placeholder.com/150",
          },
          addedAt: "2024-01-16T14:20:00Z",
        },
        {
          _id: "cart3",
          user: {
            _id: "user2",
            fullName: "Trần Thị B",
            email: "tranthib@example.com",
          },
          course: {
            _id: "course3",
            title: "Machine Learning A-Z",
            price: 89.99,
            imageUrl: "https://via.placeholder.com/150",
          },
          addedAt: "2024-01-17T09:15:00Z",
        },
      ];
      setCarts(mockCarts);
    } catch (error) {
      console.error("Error fetching carts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCart = async (cartId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mục này khỏi giỏ hàng?")) return;

    try {
      await axios.delete(`/carts/${cartId}`);
      setCarts(carts.filter((item) => item._id !== cartId));
      alert("Đã xóa mục khỏi giỏ hàng!");
    } catch (error) {
      console.error("Error deleting cart item:", error);
      alert("Không thể xóa mục giỏ hàng. Vui lòng thử lại.");
    }
  };

  const filteredCarts = carts.filter(
    (item) =>
      item.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by user
  const cartsByUser = filteredCarts.reduce((acc, item) => {
    const userId = item.user._id;
    if (!acc[userId]) {
      acc[userId] = {
        user: item.user,
        items: [],
      };
    }
    acc[userId].items.push(item);
    return acc;
  }, {} as Record<string, { user: CartItem["user"]; items: CartItem[] }>);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Quản lý giỏ hàng</h1>
                <p className="text-purple-100">
                  Tổng số: {carts.length} mục trong giỏ hàng
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên người dùng, email hoặc khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Carts List Grouped by User */}
        <div className="space-y-6">
          {Object.values(cartsByUser).map((userCart) => (
            <div
              key={userCart.user._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* User Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {userCart.user.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">{userCart.user.email}</p>
                </div>
                <span className="ml-auto bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                  {userCart.items.length} khóa học
                </span>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {userCart.items.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Course Image */}
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={item.course.imageUrl || "/placeholder.jpg"}
                          alt={item.course.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {item.course.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="font-semibold text-green-600">
                                ${item.course.price.toFixed(2)}
                              </span>
                              <span>
                                Thêm vào:{" "}
                                {new Date(item.addedAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => handleDeleteCart(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-gray-50 border-t border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">
                    Tổng giá trị:
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    $
                    {userCart.items
                      .reduce((sum, item) => sum + item.course.price, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCarts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy giỏ hàng
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Thử tìm kiếm với từ khóa khác"
                : "Chưa có người dùng nào thêm khóa học vào giỏ hàng"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCarts;
