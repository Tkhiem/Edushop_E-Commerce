import React, { useState, useEffect } from "react";
import { X, Plus, BookOpen, DollarSign, Tag, User, Globe, Clock, Video } from "lucide-react";
import axios from "../../api/axiosConfig";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  category: string;
  instructor: string;
  level: string;
  language: string;
  duration: number;
  lectures: number;
  isBestseller: boolean;
  tags: string;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    slug: "",
    description: "",
    thumbnail: "https://via.placeholder.com/640x360?text=Course+Image",
    price: 0,
    originalPrice: 0,
    discountPercentage: 0,
    category: "",
    instructor: "",
    level: "all levels",
    language: "English",
    duration: 0,
    lectures: 0,
    isBestseller: false,
    tags: "",
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories");
      // API trả về mảng trực tiếp, không có wrapper
      if (Array.isArray(response.data)) {
        setCategories(response.data.map((cat: any) => cat.name));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Auto-generate slug from title (remove Vietnamese diacritics)
  useEffect(() => {
    if (formData.title) {
      // Remove Vietnamese diacritics
      let slug = formData.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .replace(/[^\w\s-]/g, "") // Remove special chars
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/--+/g, "-") // Replace multiple - with single -
        .trim();
      
      // Add random suffix to ensure uniqueness
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      slug = `${slug}-${randomSuffix}`;
      
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title]);

  // Auto-calculate discounted price
  useEffect(() => {
    if (formData.originalPrice && formData.discountPercentage) {
      const discounted =
        formData.originalPrice * (1 - formData.discountPercentage / 100);
      setFormData((prev) => ({
        ...prev,
        price: Math.round(discounted),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        price: formData.originalPrice,
      }));
    }
  }, [formData.originalPrice, formData.discountPercentage]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }
    if (!formData.category) {
      newErrors.category = "Danh mục là bắt buộc";
    }
    if (!formData.instructor.trim()) {
      newErrors.instructor = "Giảng viên là bắt buộc";
    }
    if (formData.originalPrice <= 0) {
      newErrors.originalPrice = "Giá phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Convert VND to USD (assuming 1 USD = 24000 VND)
      const USD_TO_VND_RATE = 24000;
      const priceInUSD = formData.price / USD_TO_VND_RATE;
      const originalPriceInUSD = formData.originalPrice / USD_TO_VND_RATE;

      const courseData = {
        ...formData,
        price: parseFloat(priceInUSD.toFixed(2)),
        originalPrice: parseFloat(originalPriceInUSD.toFixed(2)),
        discountedPrice: parseFloat(priceInUSD.toFixed(2)),
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      console.log("🚀 API Request: POST /courses", courseData);
      const response = await axios.post("/courses", courseData);

      if (response.data.success) {
        alert("Thêm khóa học thành công!");
        onSuccess();
        onClose();
        resetForm();
      }
    } catch (error: any) {
      console.error("❌ Error creating course:", error);
      console.error("Error details:", error.response?.data);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || "Lỗi khi tạo khóa học. Vui lòng thử lại.";
      
      alert(`Lỗi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      thumbnail: "https://via.placeholder.com/640x360?text=Course+Image",
      price: 0,
      originalPrice: 0,
      discountPercentage: 0,
      category: "",
      instructor: "",
      level: "all levels",
      language: "English",
      duration: 0,
      lectures: 0,
      isBestseller: false,
      tags: "",
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Thêm khóa học mới</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
            title="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-140px)] bg-gray-50">
          {/* Section: Thông tin cơ bản */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Thông tin cơ bản</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề khóa học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Ví dụ: Lập trình React từ cơ bản đến nâng cao"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả khóa học
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Mô tả chi tiết về nội dung, mục tiêu và lợi ích của khóa học..."
                />
              </div>

              {/* Thumbnail */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL Hình ảnh
                </label>
                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.thumbnail && (
                  <div className="mt-3">
                    <img 
                      src={formData.thumbnail} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Invalid+Image';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Phân loại */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <Tag className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Phân loại & Giảng viên</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer ${
                    errors.category ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem'
                  }}
                >
                  <option value="" disabled>-- Chọn danh mục --</option>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Đang tải...</option>
                  )}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.category}
                  </p>
                )}
              </div>

              {/* Instructor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Giảng viên <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.instructor ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Tên giảng viên"
                />
                {errors.instructor && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.instructor}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Giá tiền */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Giá tiền & Khuyến mại</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Price (VND) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá gốc (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.originalPrice ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="1.000.000"
                  min="0"
                  step="1000"
                />
                {errors.originalPrice && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.originalPrice}
                  </p>
                )}
              </div>

              {/* Discount Percentage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giảm giá (%)
                </label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0-100"
                  min="0"
                  max="100"
                />
              </div>

              {/* Final Price (Auto-calculated, VND) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá sau giảm (VNĐ)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.price.toLocaleString("vi-VN") + " ₫"}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 text-gray-800 font-semibold text-lg"
                  />
                  <span className="absolute right-3 top-3 text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded">
                    Tự động tính
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2 italic">
                  📊 Giá này được tính dựa trên giá gốc và % giảm giá
                </p>
              </div>
            </div>
          </div>

          {/* Section: Chi tiết khóa học */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Chi tiết khóa học</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cấp độ
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem'
                  }}
                >
                  <option value="all levels">🎓 Tất cả cấp độ</option>
                  <option value="beginner">🌱 Người mới bắt đầu</option>
                  <option value="intermediate">📈 Trung cấp</option>
                  <option value="advanced">🚀 Nâng cao</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    Ngôn ngữ
                  </div>
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem'
                  }}
                >
                  <option value="English">🇬🇧 English</option>
                  <option value="Vietnamese">🇻🇳 Tiếng Việt</option>
                  <option value="Chinese">🇨🇳 Chinese</option>
                  <option value="Japanese">🇯🇵 Japanese</option>
                  <option value="Korean">🇰🇷 Korean</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Thời lượng (giờ)
                  </div>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ví dụ: 10.5"
                  min="0"
                  step="0.5"
                />
              </div>

              {/* Lectures */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    Số bài giảng
                  </div>
                </label>
                <input
                  type="number"
                  name="lectures"
                  value={formData.lectures}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ví dụ: 50"
                  min="0"
                />
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    Thẻ tags (phân cách bằng dấu phẩy)
                  </div>
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ví dụ: react, javascript, web development, frontend"
                />
              </div>

              {/* Is Bestseller */}
              <div className="md:col-span-2">
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isBestseller"
                      checked={formData.isBestseller}
                      onChange={handleChange}
                      className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-800">
                        🌟 Đánh dấu là Bestseller
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        Khóa học này sẽ được hiển thị với badge đặc biệt
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white sticky bottom-0 px-8 py-5 border-t-2 border-gray-200 flex items-center justify-between shadow-lg">
            <p className="text-sm text-gray-600">
              <span className="text-red-500">*</span> Các trường bắt buộc
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium"
                disabled={loading}
              >
                ✕ Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tạo...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Tạo khóa học</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;
