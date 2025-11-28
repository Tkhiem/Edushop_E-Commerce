import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import SidebarFilter from "../components/common/SidebarFilter";
import Skeleton from "../components/ui/Skeleton";
import api from "../api/axiosConfig";
import { useOwnedCourses } from "../hooks/useOwnedCourses";
import SEO from "../components/SEO";

// Define Course interface
interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  reviews?: number;
  level: string;
  language?: string;
  duration: number;
  lectures: number;
  tags?: string[];
  isBestseller?: boolean;
  isNew?: boolean;
}

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const itemsPerPage = 12;
  const { ownedCourseIds } = useOwnedCourses();

  const filteredCourses = useMemo(() => {
    if (!ownedCourseIds.length) return courses;
    return courses.filter((course) => !ownedCourseIds.includes(course._id));
  }, [courses, ownedCourseIds]);

  // Load courses when component mounts or filters change
  useEffect(() => {
    console.log("🔄 HomePage mounted or filters changed");
    loadCourses();
  }, [selectedCategories, selectedLevels, priceRange, sortBy, currentPage, searchQuery]);

  // Handle URL params for category and search
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    
    if (categoryParam) {
      console.log("🔗 Category from URL:", categoryParam);
      setSelectedCategories([categoryParam]);
    }
    
    if (searchParam) {
      console.log("🔍 Search from URL:", searchParam);
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params: Record<string, any> = {
        page: currentPage,
        limit: itemsPerPage,
        sort: sortBy,
      };

      if (selectedCategories.length > 0) {
        params.category = selectedCategories.join(",");
      }

      if (selectedLevels.length > 0) {
        params.level = selectedLevels.join(",");
      }

      if (priceRange[0] > 0 || priceRange[1] < 200) {
        params.minPrice = priceRange[0];
        params.maxPrice = priceRange[1];
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      console.log("🔍 Fetching courses with params:", params);

      // Use centralized axios instance (reads VITE_API_URL at build time)
      const response = await api.get("/courses", {
        params,
      });

      console.log("✅ API Response:", response.data);

      if (response.data.success && response.data.data) {
        const coursesData = response.data.data;
        setCourses(coursesData);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalCourses(response.data.pagination?.totalCourses || 0);
        console.log(`✅ Loaded ${coursesData.length} courses`);
      } else {
        console.error("❌ API returned success=false");
        setError("Không thể tải danh sách khóa học");
      }
    } catch (err: any) {
      console.error("❌ Error loading courses:", err);

      if (!err.response) {
        setError(
          "❌ Không thể kết nối đến server\n\n" +
            "Kiểm tra:\n" +
            "• Backend đang chạy? (npm run dev)\n" +
            "• MongoDB đã kết nối?\n" +
            "• Port 5000 có sẵn?"
        );
      } else if (err.response.status === 404) {
        setError("❌ API endpoint không tồn tại: /api/courses");
      } else {
        setError(
          err.response?.data?.message ||
            "Lỗi không xác định. Kiểm tra backend logs."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    console.log("🧹 Clearing all filters");
    setSelectedCategories([]);
    setSelectedLevels([]);
    setPriceRange([0, 200]);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    console.log("📄 Changing to page:", page);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  console.log("🎨 Rendering HomePage - courses:", courses.length);

  // Loading State
  if (loading && courses.length === 0) {
    console.log("⏳ Showing loading skeleton");
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Hero Skeleton */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <Skeleton className="h-12 w-96 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-6 w-128 mx-auto mb-8 bg-white/20" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            <Skeleton className="hidden lg:block w-80 h-screen" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="h-96" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    console.log("❌ Showing error state:", error);
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Đã có lỗi xảy ra
            </h2>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <pre className="text-sm text-left text-red-800 whitespace-pre-wrap">
                {error}
              </pre>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={loadCourses}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🔄 Thử lại
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                🔃 Tải lại trang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("✅ Rendering main content with", courses.length, "courses");

  // SEO Content - Đáp ứng yêu cầu 1 điểm: Trang viết SEO content
  const seoTitle = searchQuery 
    ? `Tìm kiếm: ${searchQuery}` 
    : selectedCategories.length > 0 
      ? `Khóa học ${selectedCategories.join(', ')}`
      : "Khóa học trực tuyến chất lượng cao";
  
  const seoDescription = `Khám phá ${totalCourses.toLocaleString()}+ khóa học trực tuyến chất lượng cao tại EduShop. Học từ các chuyên gia hàng đầu với giá ưu đãi. Lập trình, Kinh doanh, Thiết kế, Marketing và nhiều hơn nữa. Chứng chỉ được công nhận quốc tế.`;
  
  const seoKeywords = "khóa học online, học trực tuyến, edushop, lập trình, kinh doanh, thiết kế, marketing, data science, tiếng anh, kỹ năng mềm, chứng chỉ quốc tế, udemy vietnam";

  // Main Content
  return (
    <>
      {/* SEO Meta Tags cho trang chủ */}
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        type="website"
      />

      {/* Đoạn text SEO: mô tả, FAQ, lợi ích */}
      <section style={{margin: '32px 0', padding: '24px', background: '#f8f8fc', borderRadius: '12px'}}>
        <h2>EduShop - Nền tảng khóa học trực tuyến hàng đầu Việt Nam</h2>
        <p>
          EduShop cung cấp hàng ngàn khóa học chất lượng cao về lập trình, thiết kế, marketing, kinh doanh, ngoại ngữ và nhiều lĩnh vực khác. Bạn có thể học mọi lúc, mọi nơi với đội ngũ giảng viên uy tín, nội dung cập nhật liên tục và hỗ trợ 24/7.
        </p>
        <h3>Những lợi ích khi học tại EduShop</h3>
        <ul>
          <li>Truy cập kho kiến thức khổng lồ với chi phí hợp lý</li>
          <li>Chứng nhận hoàn thành khóa học uy tín</li>
          <li>Hỗ trợ trực tuyến qua Messenger, Zalo, và Live Chat</li>
          <li>Cập nhật nội dung mới liên tục</li>
          <li>Học tập linh hoạt trên mọi thiết bị</li>
        </ul>
        <h3>Câu hỏi thường gặp (FAQ)</h3>
        <dl>
          <dt>EduShop có miễn phí không?</dt>
          <dd>Một số khóa học miễn phí, phần lớn là trả phí với giá ưu đãi.</dd>
          <dt>Tôi có được cấp chứng chỉ sau khi học không?</dt>
          <dd>Có, bạn sẽ nhận chứng chỉ điện tử sau khi hoàn thành khóa học.</dd>
          <dt>Làm sao để liên hệ hỗ trợ?</dt>
          <dd>Bạn có thể chat trực tiếp qua Messenger, Zalo hoặc Live Chat trên website.</dd>
        </dl>
      </section>

      <div className="min-h-screen bg-slate-50">
        {/* Hero Section with SEO-optimized content */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">
              Khám phá tri thức mới 🚀
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Hơn {totalCourses.toLocaleString()}+ khóa học chất lượng
            </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold">
                {totalCourses.toLocaleString()}+
              </div>
              <div className="text-sm text-blue-100">Khóa học</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl mb-2">👨‍🏫</div>
              <div className="text-2xl font-bold">100+</div>
              <div className="text-sm text-blue-100">Giảng viên</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold">4.5+</div>
              <div className="text-sm text-blue-100">Đánh giá</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl mb-2">🎓</div>
              <div className="text-2xl font-bold">50,000+</div>
              <div className="text-sm text-blue-100">Học viên</div>
            </div>
          </div>
        </div>
      </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-80">
            <div className="sticky top-4">
              <SidebarFilter
                selectedCategories={selectedCategories}
                onCategoryChange={setSelectedCategories}
                selectedLevels={selectedLevels}
                onLevelChange={setSelectedLevels}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search Result Header */}
            {searchQuery && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      Kết quả tìm kiếm cho: "{searchQuery}"
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Tìm thấy {totalCourses} khóa học
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      window.history.pushState({}, "", "/");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ✕ Xóa tìm kiếm
                  </button>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {searchQuery ? "Kết quả tìm kiếm" : "Khóa học phổ biến"}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredCourses.length > 0 ? (
                    <>
                      Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      totalCourses
                    )} /{" "}
                    {totalCourses} khóa học
                    </>
                  ) : (
                    "Không có khóa học nào"
                  )}
                </p>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="newest">Mới nhất</option>
                <option value="popular">Phổ biến</option>
                <option value="rating">Đánh giá</option>
                <option value="price-asc">Giá tăng</option>
                <option value="price-desc">Giá giảm</option>
              </select>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredCourses.map((course) => (
                    <ProductCard
                      key={course._id}
                      product={{
                        _id: course._id,
                        id: course._id,
                        title: course.title,
                        slug: course.slug,
                        description: course.description,
                        thumbnail: course.thumbnail,
                        price: course.price,
                        originalPrice: course.originalPrice || course.price,
                        discountedPrice: course.price,
                        discountPercentage: course.discountPercentage || 0,
                        category: course.category,
                        instructor: course.instructor,
                        rating: course.rating,
                        students: course.students,
                        reviews: course.reviews || 0,
                        level: course.level,
                        language: course.language || "Tiếng Anh",
                        duration: course.duration,
                        lectures: course.lectures,
                        tags: course.tags || [],
                        isBestseller: course.isBestseller || false,
                        isNew: course.isNew || false,
                      }}
                      onClick={(product) => navigate(`/course/${product.slug}`)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50"
                    >
                      ← Trước
                    </button>

                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg ${
                            page === currentPage
                              ? "bg-blue-600 text-white"
                              : "border"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold mb-2">
                  Không tìm thấy khóa học
                </h3>
                <p className="text-gray-600 mb-6">
                  Thử thay đổi bộ lọc hoặc tìm kiếm
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </main>
        </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;