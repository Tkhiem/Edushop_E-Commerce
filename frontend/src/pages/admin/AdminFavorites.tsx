import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Heart, Search, Trash2, User, BookOpen } from "lucide-react";
import axios from "../../api/axiosConfig";

interface FavoriteItem {
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
    category?: string;
    imageUrl?: string;
  };
  addedAt: string;
}

const AdminFavorites: React.FC = () => {
  const { isAdmin } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      // Note: Backend needs GET /api/favorites/admin/all endpoint
      // For now using mock data
      const mockFavorites: FavoriteItem[] = [
        {
          _id: "fav1",
          user: {
            _id: "user1",
            fullName: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
          },
          course: {
            _id: "course1",
            title: "Complete Web Development Bootcamp",
            price: 99.99,
            category: "Web Development",
            imageUrl: "https://via.placeholder.com/150",
          },
          addedAt: "2024-01-10T08:30:00Z",
        },
        {
          _id: "fav2",
          user: {
            _id: "user1",
            fullName: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
          },
          course: {
            _id: "course4",
            title: "React Advanced Patterns",
            price: 79.99,
            category: "Web Development",
            imageUrl: "https://via.placeholder.com/150",
          },
          addedAt: "2024-01-12T15:45:00Z",
        },
        {
          _id: "fav3",
          user: {
            _id: "user2",
            fullName: "Trần Thị B",
            email: "tranthib@example.com",
          },
          course: {
            _id: "course5",
            title: "Python for Data Science",
            price: 89.99,
            category: "Data Science",
            imageUrl: "https://via.placeholder.com/150",
          },
          addedAt: "2024-01-14T10:20:00Z",
        },
        {
          _id: "fav4",
          user: {
            _id: "user3",
            fullName: "Lê Văn C",
            email: "levanc@example.com",
          },
          course: {
            _id: "course6",
            title: "Machine Learning Fundamentals",
            price: 99.99,
            category: "Data Science",
            imageUrl: "https://via.placeholder.com/150",
          },
          addedAt: "2024-01-15T11:30:00Z",
        },
      ];
      setFavorites(mockFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFavorite = async (favoriteId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mục yêu thích này?")) return;

    try {
      await axios.delete(`/favorites/${favoriteId}`);
      setFavorites(favorites.filter((item) => item._id !== favoriteId));
      alert("Đã xóa mục yêu thích!");
    } catch (error) {
      console.error("Error deleting favorite:", error);
      alert("Không thể xóa mục yêu thích. Vui lòng thử lại.");
    }
  };

  const filteredFavorites = favorites.filter(
    (item) =>
      item.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by user
  const favoritesByUser = filteredFavorites.reduce((acc, item) => {
    const userId = item.user._id;
    if (!acc[userId]) {
      acc[userId] = {
        user: item.user,
        items: [],
      };
    }
    acc[userId].items.push(item);
    return acc;
  }, {} as Record<string, { user: FavoriteItem["user"]; items: FavoriteItem[] }>);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Quản lý khóa học yêu thích
                </h1>
                <p className="text-red-100">
                  Tổng số: {favorites.length} mục yêu thích
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
              placeholder="Tìm kiếm theo tên người dùng, email, khóa học hoặc danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Favorites List Grouped by User */}
        <div className="space-y-6">
          {Object.values(favoritesByUser).map((userFavorites) => (
            <div
              key={userFavorites.user._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* User Header */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-200 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {userFavorites.user.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {userFavorites.user.email}
                  </p>
                </div>
                <span className="ml-auto bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {userFavorites.items.length} yêu thích
                </span>
              </div>

              {/* Favorite Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {userFavorites.items.map((item) => (
                  <div
                    key={item._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Course Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.course.imageUrl || "/placeholder.jpg"}
                          alt={item.course.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium text-gray-900 line-clamp-2">
                            {item.course.title}
                          </h4>
                          <button
                            onClick={() => handleDeleteFavorite(item._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          {item.course.category && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <BookOpen className="w-4 h-4" />
                              <span>{item.course.category}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-green-600">
                              ${item.course.price.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(item.addedAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredFavorites.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy mục yêu thích
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Thử tìm kiếm với từ khóa khác"
                : "Chưa có người dùng nào thêm khóa học vào danh sách yêu thích"}
            </p>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Tổng yêu thích</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {favorites.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Người dùng</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {Object.keys(favoritesByUser).length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">TB/Người dùng</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {Object.keys(favoritesByUser).length > 0
                ? (
                    favorites.length / Object.keys(favoritesByUser).length
                  ).toFixed(1)
                : "0"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFavorites;
