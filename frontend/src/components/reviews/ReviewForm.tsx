import React, { useState } from "react";
import { Star, Send, X } from "lucide-react";
import axios from "../../api/axiosConfig";
import { useAuth } from "../../hooks/useAuth";

interface ReviewFormProps {
  courseId: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  courseId,
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Vui lòng đăng nhập để đánh giá");
      return;
    }

    if (rating === 0) {
      setError("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Đánh giá phải có ít nhất 10 ký tự");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        course_id: courseId,
        rating,
        comment: comment.trim(),
      };

      console.log("📝 Sending review payload:", payload);

      const response = await axios.post("/reviews", payload);

      console.log("✅ Review submitted successfully:", response.data);

      // Reset form
      setRating(0);
      setComment("");
      alert("Đánh giá của bạn đã được gửi thành công!");
      onSuccess();
    } catch (err: any) {
      console.error("Error submitting review:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      const errorMessage =
        err.response?.data?.message || 
        err.response?.data?.error ||
        "Không thể gửi đánh giá. Vui lòng thử lại.";
      
      setError(errorMessage);
      alert(`Lỗi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-blue-800">
          Vui lòng{" "}
          <a href="/login" className="font-semibold underline">
            đăng nhập
          </a>{" "}
          để viết đánh giá
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Viết đánh giá của bạn</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá của bạn <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm font-medium text-gray-700">
                {rating === 1 && "Rất tệ"}
                {rating === 2 && "Tệ"}
                {rating === 3 && "Trung bình"}
                {rating === 4 && "Tốt"}
                {rating === 5 && "Xuất sắc"}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nhận xét của bạn <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Chia sẻ trải nghiệm của bạn về khóa học này..."
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Tối thiểu 10 ký tự ({comment.length}/10)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={loading || rating === 0 || comment.trim().length < 10}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Gửi đánh giá
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
