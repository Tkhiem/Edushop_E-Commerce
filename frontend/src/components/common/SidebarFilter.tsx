import { Category } from "../../api/categories.api";
import { FilterState } from "../../types/filter";
import CollapsibleSection from "../ui/CollapsibleSection";
import Checkbox from "../ui/Checkbox";
import Slider from "../ui/Slider";

interface SidebarFilterProps {
  categories: Category[];
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

const LEVELS = [
  { value: "all", label: "Tất cả cấp độ" },
  { value: "beginner", label: "Người mới bắt đầu" },
  { value: "intermediate", label: "Trung cấp" },
  { value: "advanced", label: "Nâng cao" },
];

export default function SidebarFilter({
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}: SidebarFilterProps) {
  const handleCategoryChange = (categorySlug: string) => {
    const newCategories = filters.categories.includes(categorySlug)
      ? filters.categories.filter((c) => c !== categorySlug)
      : [...filters.categories, categorySlug];
    onFilterChange({ categories: newCategories });
  };

  const handleLevelChange = (level: string) => {
    const newLevels = filters.levels.includes(level)
      ? filters.levels.filter((l) => l !== level)
      : [...filters.levels, level];
    onFilterChange({ levels: newLevels });
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ priceRange: { min: value[0], max: value[1] } });
  };

  const handleRatingChange = (rating: number) => {
    const newRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter((r) => r !== rating)
      : [...filters.ratings, rating];
    onFilterChange({ ratings: newRatings });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Bộ lọc
        </h2>
        <button
          onClick={onResetFilters}
          className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Results Count */}
      <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
        <p className="text-sm text-gray-700">
          Tìm thấy{" "}
          <span className="font-bold text-green-600">{totalResults}</span> khóa
          học
        </p>
      </div>

      {/* Categories */}
      <CollapsibleSection title="📚 Danh mục" defaultOpen>
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {categories.map((category) => (
            <Checkbox
              key={category.category_id}
              label={category.name}
              checked={filters.categories.includes(category.slug)}
              onChange={() => handleCategoryChange(category.slug)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Levels */}
      <CollapsibleSection title="📊 Cấp độ" defaultOpen>
        <div className="space-y-1">
          {LEVELS.map((level) => (
            <Checkbox
              key={level.value}
              label={level.label}
              checked={filters.levels.includes(level.value)}
              onChange={() => handleLevelChange(level.value)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Price Range */}
      <CollapsibleSection title="💰 Khoảng giá" defaultOpen>
        <div className="px-2 py-2">
          <Slider
            min={0}
            max={100}
            value={[filters.priceRange.min, filters.priceRange.max]}
            onChange={handlePriceChange}
            formatLabel={(value) => `$${value}`}
          />
        </div>
      </CollapsibleSection>

      {/* Ratings */}
      <CollapsibleSection title="⭐ Đánh giá">
        <div className="space-y-1">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors group"
            >
              <input
                type="checkbox"
                checked={filters.ratings.includes(rating)}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4 accent-green-600 cursor-pointer"
              />
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm group-hover:text-green-600">
                  {rating} trở lên
                </span>
              </div>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      {/* Suggest Button */}
      <button className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
        🎯 Gợi ý sản phẩm phù hợp
      </button>
    </div>
  );
}
