import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import axios from "../../api/axiosConfig";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
} from "lucide-react";
import { formatPrice } from "../../utils/currency";
import AddCourseModal from "../../components/admin/AddCourseModal";
import EditCourseModal from "../../components/admin/EditCourseModal";

interface Course {
  _id: string;
  title: string;
  slug: string;
  category: string;
  instructor: string;
  price: number;
  rating: number;
  students: number;
  level: string;
  publishedDate: string;
}

const AdminCourses: React.FC = () => {
  const { isAdmin } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  useEffect(() => {
    fetchCourses();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 20,
      };

      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get("/courses", { params });

      if (response.data.success) {
        // API returns { success, data: [courses], pagination }
        setCourses(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    setSelectedCourseId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) return;

    try {
      await axios.delete(`/courses/${id}`);
      alert("Xóa thành công!");
      fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi xóa khóa học");
    }
  };

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
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Quản lý khóa học
                </h1>
                <p className="text-gray-600 text-sm">
                  Tổng: {courses.length} khóa học
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Thêm khóa học
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo ID, tiêu đề, giảng viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              <option value="Lập Trình">Lập Trình</option>
              <option value="Kinh Doanh & Tài Chính">
                Kinh Doanh & Tài Chính
              </option>
              <option value="Thiết Kế Đồ Họa">Thiết Kế Đồ Họa</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Khóa học
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Danh mục
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Giảng viên
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Giá
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Học viên
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-xs font-mono text-gray-600 truncate">
                            {course._id}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 truncate">
                            {course.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {course.level}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course.instructor}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {formatPrice(course.price)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium text-gray-900">
                            {course.rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course.students.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(course._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Trước
              </button>
              <span className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          )}
        </div>

        {/* Add Course Modal */}
        <AddCourseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchCourses();
          }}
        />

        {/* Edit Course Modal */}
        <EditCourseModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchCourses();
          }}
          courseId={selectedCourseId}
        />
      </div>
    </div>
  );
};

export default AdminCourses;
