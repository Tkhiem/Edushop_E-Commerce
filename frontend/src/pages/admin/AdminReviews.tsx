import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import axios from "../../api/axiosConfig";
import { Star, MessageSquare, Trash2, Search } from "lucide-react";

interface Review {
  _id: string;
  course_id: {
    _id: string;
    title: string;
  };
  user_id: {
    _id: string;
    full_name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

const AdminReviews: React.FC = () => {
  const { isAdmin } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/reviews/all");
      if (response.data.success) {
        setReviews(response.data.data || []);
      }
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể tải danh sách đánh giá";
      alert(`Lỗi: ${errorMessage}`);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;

    try {
      await axios.delete(`/reviews/${id}`);
      alert("Xóa thành công!");
      fetchReviews();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi xóa đánh giá");
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.course_id?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      review.user_id?.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesRating =
      !ratingFilter || review.rating === parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Quản lý đánh giá
                </h1>
                <p className="text-gray-600 text-sm">
                  Tổng: {filteredReviews.length} đánh giá
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm đánh giá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Tất cả rating</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
              Đang tải...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
              Không có đánh giá nào
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.user_id?.full_name?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {review.user_id?.full_name || "Unknown User"}
                        </h3>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map(
                            (_, idx) => (
                              <Star
                                key={idx}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              />
                            )
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Khóa học: {review.course_id?.title || "N/A"}
                      </p>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
