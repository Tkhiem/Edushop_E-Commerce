import axiosInstance from "./axiosConfig";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  courseCount?: number;
}

/**
 * Fetch all categories
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get<Category[]>("/categories");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching categories:", error);

    // Return mock categories if API fails
    if (!error.response) {
      console.warn("Backend not available, using mock categories");
      return [
        { _id: "1", name: "Lập Trình", slug: "lap-trinh", icon: "💻" },
        {
          _id: "2",
          name: "Kinh Doanh & Tài Chính",
          slug: "kinh-doanh-tai-chinh",
          icon: "💼",
        },
        {
          _id: "3",
          name: "Thiết Kế Đồ Họa",
          slug: "thiet-ke-do-hoa",
          icon: "🎨",
        },
        { _id: "4", name: "Nhạc Cụ", slug: "nhac-cu", icon: "🎸" },
        { _id: "5", name: "Marketing", slug: "marketing", icon: "📊" },
        {
          _id: "6",
          name: "Nhiếp Ảnh & Video",
          slug: "nhiep-anh-video",
          icon: "📷",
        },
        {
          _id: "7",
          name: "Công Nghệ Thông Tin",
          slug: "cong-nghe-thong-tin",
          icon: "⚙️",
        },
        {
          _id: "8",
          name: "Phát Triển Cá Nhân",
          slug: "phat-trien-ca-nhan",
          icon: "🌟",
        },
        {
          _id: "9",
          name: "Sức Khỏe & Thể Hình",
          slug: "suc-khoe-the-hinh",
          icon: "💪",
        },
      ];
    }

    throw error;
  }
};

/**
 * Fetch category by ID
 */
export const fetchCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await axiosInstance.get<Category>(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch category by slug
 */
export const fetchCategoryBySlug = async (slug: string): Promise<Category> => {
  try {
    const response = await axiosInstance.get<Category>(
      `/categories/slug/${slug}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching category by slug ${slug}:`, error);
    throw error;
  }
};

/**
 * Get categories with course counts
 */
export const fetchCategoriesWithCounts = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get<Category[]>(
      "/categories/with-counts"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories with counts:", error);
    throw error;
  }
};
