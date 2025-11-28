import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Clock,
  Users,
  BookOpen,
  Globe,
  Award,
  Play,
  CheckCircle,
  Star,
  Heart,
  ShoppingCart,
} from "lucide-react";
import axios from "../api/axiosConfig";
import { formatPrice } from "../utils/currency";
import Skeleton from "../components/ui/Skeleton";
import { useCart } from "../hooks/useCart";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../hooks/useAuth";
import { useOwnedCourses } from "../hooks/useOwnedCourses";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewList from "../components/reviews/ReviewList";
import SEO from "../components/SEO";
import ShareButton from "../components/ShareButton";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  reviews: number;
  level: string;
  language: string;
  duration: number;
  lectures: number;
  tags: string[];
  publishedDate: string;
}

const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Hooks
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite: checkIsFavorite } = useFavorites();
  const { isAuthenticated, user } = useAuth();
  const { ownedCourseIds } = useOwnedCourses();

  useEffect(() => {
    fetchCourseDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/courses/slug/${slug}`);

      if (response.data.success) {
        setCourse(response.data.data.course);
        setRelatedCourses(response.data.data.relatedCourses || []);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const isCourseOwned =
    !!course && ownedCourseIds.includes(course._id.toString());

  const handleAddToCart = async () => {
    if (isCourseOwned) {
      alert("Bạn đã đăng ký khóa học này.");
      return;
    }
    if (!isAuthenticated) {
      alert("⚠️ Vui lòng đăng nhập để thêm khóa học vào giỏ hàng!");
      navigate("/login");
      return;
    }

    if (!course) return;

    try {
      await addToCart({
        _id: course._id,
        id: course._id,
        title: course.title,
        slug: course.slug,
        thumbnail: course.thumbnail,
        price: course.price,
        discountedPrice: course.price,
        category: course.category,
        instructor: course.instructor,
        rating: course.rating,
        quantity: 1,
      });
      alert("✅ Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      alert("⚠️ Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
      navigate("/login");
      return;
    }

    if (!course) return;

    toggleFavorite({
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
      isBestseller: false,
      isNew: false,
    });
  };

  const filteredRelatedCourses = useMemo(() => {
    if (!relatedCourses.length) return [];
    if (!ownedCourseIds.length) return relatedCourses;
    return relatedCourses.filter(
      (related) => !ownedCourseIds.includes(related._id)
    );
  }, [relatedCourses, ownedCourseIds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-96 rounded-xl mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 rounded-xl" />
            </div>
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy khóa học
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-700"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  // SEO & Share data
  const courseUrl = typeof window !== 'undefined' ? window.location.href : '';
  const seoKeywords = `${course.title}, ${course.category}, khóa học online, học trực tuyến, ${course.instructor}, ${course.tags.join(', ')}`;

  return (
    <>
      {/* SEO Meta Tags - Đáp ứng yêu cầu 2 điểm */}
      <SEO
        title={course.title}
        description={course.description}
        image={course.thumbnail}
        url={courseUrl}
        type="product"
        keywords={seoKeywords}
        author={course.instructor}
        publishedTime={course.publishedDate}
        price={course.price}
        currency="VND"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Trang chủ
            </Link>
            <span className="text-gray-500">/</span>
            <Link
              to={`/?category=${course.category}`}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {course.category}
            </Link>
            <span className="text-gray-500">/</span>
            <span>{course.title}</span>
          </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Course Info */}
              <div className="lg:col-span-2">
                <div className="inline-block px-3 py-1 bg-blue-600 rounded-full text-sm mb-4">
                  {course.category}
                </div>

                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-gray-300 text-lg mb-6">{course.description}</p>

              {isCourseOwned && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                      ĐÃ ĐĂNG KÝ
                    </span>
                    <p className="text-emerald-800 font-medium">
                      Bạn đã đăng ký khóa học này. Hãy tiếp tục lộ trình học tập!
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/my-courses")}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition-colors"
                  >
                    Đi tới khóa học
                  </button>
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{course.rating}</span>
                  </div>
                  <span className="text-gray-300">
                    ({course.reviews.toLocaleString()} đánh giá)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.students.toLocaleString()} học viên</span>
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span>{course.language}</span>
                </div>
              </div>

                {/* Instructor */}
                <div className="flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/80?u=${course.instructor}`}
                    alt={course.instructor}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-sm text-gray-400">Giảng viên</p>
                    <p className="font-semibold">{course.instructor}</p>
                  </div>
                </div>
              </div>

              {/* Right: Course Preview Card */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-4">
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                  </button>
                </div>

                <div className="p-6">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatPrice(course.price)}
                      </span>
                      {course.discountPercentage > 0 && (
                        <>
                          <span className="text-lg text-gray-400 line-through">
                            {formatPrice(course.originalPrice)}
                          </span>
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
                            -{course.discountPercentage}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3 mb-6">
                    {isCourseOwned ? (
                      <button
                        onClick={() => navigate("/my-courses")}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Học ngay
                      </button>
                    ) : (
                      <button
                        onClick={handleAddToCart}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Thêm vào giỏ hàng
                      </button>
                    )}

                    <button
                      onClick={handleToggleFavorite}
                      className={`w-full py-3 border-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        course && checkIsFavorite(course._id)
                          ? "border-red-500 text-red-500 bg-red-50"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          course && checkIsFavorite(course._id) ? "fill-red-500" : ""
                        }`}
                      />
                      {course && checkIsFavorite(course._id) ? "Đã yêu thích" : "Yêu thích"}
                    </button>

                    {/* Share Button - Đáp ứng yêu cầu Share Facebook */}
                    <div className="w-full">
                      <ShareButton
                        url={courseUrl}
                        title={course.title}
                        description={course.description}
                      />
                    </div>
                  </div>

                  {/* Course Includes */}
                  <div className="border-t pt-6 space-y-3">
                    <p className="font-semibold text-gray-900 mb-4">
                      Khóa học này bao gồm:
                    </p>

                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span>
                        {Math.floor(course.duration / 60)} giờ{" "}
                        {course.duration % 60} phút video
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <span>{course.lectures} bài giảng</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Award className="w-5 h-5 text-gray-400" />
                      <span>Chứng chỉ hoàn thành</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <span>Truy cập trọn đời</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Bạn sẽ học được gì
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Nắm vững kiến thức cơ bản và nâng cao",
                  "Xây dựng dự án thực tế",
                  "Áp dụng vào công việc ngay lập tức",
                  "Nhận chứng chỉ hoàn thành khóa học",
                  "Hỗ trợ từ giảng viên và cộng đồng",
                  "Cập nhật nội dung mới nhất",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Mô tả khóa học
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p>{course.description}</p>
                <p className="mt-4">
                  Khóa học này được thiết kế dành cho những người muốn học từ cơ
                  bản đến nâng cao. Bạn sẽ được hướng dẫn từng bước một cách chi
                  tiết và dễ hiểu.
                </p>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Nội dung khóa học
              </h2>
              <div className="space-y-4">
                {[
                  "Giới thiệu và chuẩn bị",
                  "Kiến thức cơ bản",
                  "Thực hành nâng cao",
                  "Dự án thực tế",
                  "Tổng kết và chứng chỉ",
                ].map((section, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900">
                          {section}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {Math.floor(course.lectures / 5)} bài giảng
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Giảng viên
              </h2>
              <div className="flex items-start gap-6">
                <img
                  src={`https://i.pravatar.cc/120?u=${course.instructor}`}
                  alt={course.instructor}
                  className="w-24 h-24 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.instructor}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Chuyên gia với hơn 10 năm kinh nghiệm trong lĩnh vực{" "}
                    {course.category}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>4.8 rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>50,000+ học viên</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Sticky Sidebar (Mobile CTA) */}
          <div className="lg:hidden">
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(course.price)}
                    </span>
                    {course.discountPercentage > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(course.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                {isCourseOwned ? (
                  <button
                    onClick={() => navigate("/my-courses")}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Học ngay
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Mua ngay
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {course && (
        <div className="bg-white py-12 border-t">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Đánh giá từ học viên
            </h2>
            
            {/* Review Form - Show if user is logged in */}
            {user ? (
              <div className="mb-8">
                <ReviewForm
                  courseId={course._id}
                  onSuccess={() => {
                    // Reload reviews after successful submission
                    window.location.reload();
                  }}
                />
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center mb-8">
                <p className="text-blue-800">
                  Vui lòng{" "}
                  <a href="/login" className="font-semibold underline">
                    đăng nhập
                  </a>{" "}
                  để viết đánh giá
                </p>
              </div>
            )}

            {/* Review List */}
            <ReviewList courseId={course._id} limit={10} />
          </div>
        </div>
      )}

      {/* Related Courses */}
      {filteredRelatedCourses.length > 0 && (
        <div className="bg-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Khóa học liên quan
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelatedCourses.map((related) => (
                <Link
                  key={related._id}
                  to={`/course/${related.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <img
                    src={related.thumbnail}
                    alt={related.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {related.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {related.rating}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {formatPrice(related.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default CourseDetailPage;
