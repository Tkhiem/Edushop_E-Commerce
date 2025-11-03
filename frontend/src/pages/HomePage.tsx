import { useEffect, useState } from "react";
import { getCourses, Course } from "../api/courses.api";
import { getCategories, Category } from "../api/categories.api";
import ProductCard from "../components/product/ProductCard";
import SidebarFilter from "../components/common/SidebarFilter";
import { FilterState } from "../types/filter";

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    levels: [],
    priceRange: { min: 0, max: 100 },
    ratings: [],
    search: "",
    sort: "newest",
  });

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("🔄 Fetching courses...");
        setLoading(true);
        const response = await getCourses();

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid response format");
        }

        const validCourses = response.data.filter((course) => {
          if (!course.course_id || !course.title) {
            console.warn("⚠️ Invalid course:", course);
            return false;
          }
          return true;
        });

        console.log("✅ Valid courses:", validCourses.length);
        setCourses(validCourses);
        setFilteredCourses(validCourses);
      } catch (err: any) {
        console.error("❌ Error:", err);
        setError(err.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.data) {
          console.log("✅ Categories loaded:", response.data.length);
          setCategories(response.data);
        }
      } catch (err) {
        console.error("❌ Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...courses];

    console.log("🔍 Applying filters:", filters);

    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter((course) =>
        filters.categories.includes(course.category_slug)
      );
      console.log("  → After category filter:", result.length);
    }

    // Filter by levels
    if (filters.levels.length > 0) {
      result = result.filter((course) =>
        filters.levels.includes(course.level.toLowerCase())
      );
      console.log("  → After level filter:", result.length);
    }

    // Filter by price range
    result = result.filter((course) => {
      const price = parseFloat(course.discounted_price.toString());
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });
    console.log("  → After price filter:", result.length);

    // Filter by ratings (mock - always show all for now)
    if (filters.ratings.length > 0) {
      // TODO: Implement when rating data available
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          course.instructor_name.toLowerCase().includes(searchLower)
      );
      console.log("  → After search filter:", result.length);
    }

    // Sort
    switch (filters.sort) {
      case "price_asc":
        result.sort(
          (a, b) =>
            parseFloat(a.discounted_price.toString()) -
            parseFloat(b.discounted_price.toString())
        );
        break;
      case "price_desc":
        result.sort(
          (a, b) =>
            parseFloat(b.discounted_price.toString()) -
            parseFloat(a.discounted_price.toString())
        );
        break;
      case "newest":
        result.sort((a, b) => b.course_id - a.course_id);
        break;
      case "oldest":
        result.sort((a, b) => a.course_id - b.course_id);
        break;
      default:
        break;
    }

    console.log("✅ Final filtered courses:", result.length);
    setFilteredCourses(result);
  }, [courses, filters]);

  // Handle filter change
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    console.log("🔄 Filter changed:", newFilters);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Handle reset filters
  const handleResetFilters = () => {
    console.log("🔄 Resetting filters");
    setFilters({
      categories: [],
      levels: [],
      priceRange: { min: 0, max: 100 },
      ratings: [],
      search: "",
      sort: "newest",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xl text-gray-600">🔄 Đang tải khóa học...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-xl text-red-500 mb-4">❌ Lỗi: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Sidebar Filter */}
        <aside className="w-72 flex-shrink-0 hidden lg:block">
          <SidebarFilter
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredCourses.length}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Tất cả khóa học
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredCourses.length} khóa học có sẵn
              </p>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sort}
              onChange={(e) =>
                handleFilterChange({ sort: e.target.value as any })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer hover:border-green-500 transition-colors"
            >
              <option value="newest">⏱️ Mới nhất</option>
              <option value="oldest">📅 Cũ nhất</option>
              <option value="price_asc">💲 Giá: Thấp → Cao</option>
              <option value="price_desc">💰 Giá: Cao → Thấp</option>
            </select>
          </div>

          {/* No results */}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">📭</div>
              <div className="text-xl text-gray-600 mb-2">
                Không tìm thấy khóa học nào
              </div>
              <p className="text-gray-500 mb-6">
                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                🔄 Xóa bộ lọc
              </button>
            </div>
          ) : (
            /* Courses Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <ProductCard
                  key={course.course_id}
                  id={course.course_id}
                  title={course.title}
                  image={course.thumbnail_url || ""}
                  price={course.price}
                  discountPrice={course.discounted_price}
                  rating={4.5}
                  students={1000}
                  instructor={course.instructor_name || "Unknown"}
                  level={course.level || "All Levels"}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
