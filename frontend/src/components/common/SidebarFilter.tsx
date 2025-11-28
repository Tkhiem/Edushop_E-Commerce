import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { fetchCategories } from "../../api/categories.api";

interface SidebarFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedLevels: string[];
  onLevelChange: (levels: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  selectedCategories,
  onCategoryChange,
  selectedLevels,
  onLevelChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isLevelOpen, setIsLevelOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  const levels = [
    { value: "beginner", label: "Cơ bản" },
    { value: "intermediate", label: "Trung cấp" },
    { value: "advanced", label: "Nâng cao" },
    { value: "all levels", label: "Tất cả cấp độ" },
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();

      // ✅ Filter out unwanted categories
      const filteredCategories = data
        .filter(
          (cat) =>
            cat.name !== "Tất cả danh mục" &&
            cat.name !== "All Categories" &&
            cat.name.trim() !== ""
        )
        .map((cat) => cat.name);

      setCategories(filteredCategories);
    } catch (error) {
      console.error("Error loading categories:", error);

      // ✅ Use fallback categories if API fails
      setCategories([
        "Lập Trình",
        "Kinh Doanh & Tài Chính",
        "Thiết Kế Đồ Họa",
        "Nhạc Cụ",
        "Marketing",
        "Nhiếp Ảnh & Video",
        "Công Nghệ Thông Tin",
        "Phát Triển Cá Nhân",
        "Sức Khỏe & Thể Hình",
      ]);
    }
  };

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleLevelToggle = (level: string) => {
    if (selectedLevels.includes(level)) {
      onLevelChange(selectedLevels.filter((l) => l !== level));
    } else {
      onLevelChange([...selectedLevels, level]);
    }
  };

  const handlePriceChange = (value: number, index: 0 | 1) => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = value;
    onPriceRangeChange(newRange);
  };

  const activeFiltersCount =
    selectedCategories.length +
    selectedLevels.length +
    (priceRange[0] > 0 || priceRange[1] < 2000000 ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <X className="w-4 h-4" />
              Xóa ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {/* Category Filter */}
        <div className="p-6">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center justify-between w-full mb-4 group"
          >
            <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Danh mục
            </h4>
            {isCategoryOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            )}
          </button>

          {isCategoryOpen && (
            <div className="space-y-3">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  {/* ✅ Custom Checkbox with Circle Style */}
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                        selectedCategories.includes(category)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 group-hover:border-blue-400"
                      }`}
                    >
                      {selectedCategories.includes(category) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-sm transition-colors ${
                      selectedCategories.includes(category)
                        ? "text-blue-600 font-medium"
                        : "text-gray-700 group-hover:text-gray-900"
                    }`}
                  >
                    {category}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Level Filter */}
        <div className="p-6">
          <button
            onClick={() => setIsLevelOpen(!isLevelOpen)}
            className="flex items-center justify-between w-full mb-4 group"
          >
            <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Cấp độ
            </h4>
            {isLevelOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            )}
          </button>

          {isLevelOpen && (
            <div className="space-y-3">
              {levels.map((level) => (
                <label
                  key={level.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  {/* ✅ Custom Checkbox with Circle Style */}
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedLevels.includes(level.value)}
                      onChange={() => handleLevelToggle(level.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                        selectedLevels.includes(level.value)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 group-hover:border-blue-400"
                      }`}
                    >
                      {selectedLevels.includes(level.value) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-sm transition-colors ${
                      selectedLevels.includes(level.value)
                        ? "text-blue-600 font-medium"
                        : "text-gray-700 group-hover:text-gray-900"
                    }`}
                  >
                    {level.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="p-6">
          <button
            onClick={() => setIsPriceOpen(!isPriceOpen)}
            className="flex items-center justify-between w-full mb-4 group"
          >
            <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Khoảng giá
            </h4>
            {isPriceOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            )}
          </button>

          {isPriceOpen && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Từ
                  </label>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      handlePriceChange(Number(e.target.value), 0)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Đến
                  </label>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      handlePriceChange(Number(e.target.value), 1)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                    placeholder="2.000.000"
                  />
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-2">
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(Number(e.target.value), 1)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>0đ</span>
                  <span>2.000.000đ</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
