import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/EmptyState";
import emptyHistory from "../assets/history.svg";

interface PurchasedCourse {
  id?: string;
  _id?: string;
  slug?: string;
  title: string;
  thumbnail?: string;
  instructor?: string;
  category?: string;
  price?: number;
}

const MyCoursesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<PurchasedCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/orders/my-courses");
        if (response.data.success) {
          setCourses(response.data.data || []);
        } else {
          setError("Không thể tải danh sách khóa học.");
        }
      } catch (err) {
        console.error("Error loading purchased courses:", err);
        setError("Có lỗi xảy ra khi tải danh sách khóa học.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Khóa học của tôi
          </h1>
          <p className="text-gray-600">
            {courses.length > 0
              ? `Bạn đã mở khóa ${courses.length} khóa học`
              : "Các khóa học đã mua sẽ hiển thị tại đây"}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-56 rounded-xl" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            imageSrc={emptyHistory}
            title="Chưa có khóa học"
            description="Thanh toán thành công sẽ tự động mở khóa khóa học tại đây."
            cta={
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Khám phá khóa học
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id || course._id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="relative pb-[56%] bg-gray-100">
                  <img
                    src={
                      course.thumbnail ||
                      "https://via.placeholder.com/640x360?text=EduShop"
                    }
                    alt={course.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
                    {course.category || "Khóa học trực tuyến"}
                  </p>
                  <h2 className="text-lg font-semibold text-gray-900 mt-2 line-clamp-2 flex-1">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {course.instructor || "Giảng viên EduShop"}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      {typeof course.price === "number"
                        ? `${course.price.toFixed(2)} USD`
                        : "Truy cập trọn đời"}
                    </span>
                    <Link
                      to={`/course/${course.slug || course.id || course._id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Học ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;

