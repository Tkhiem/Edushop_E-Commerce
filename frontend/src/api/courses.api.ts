import axiosInstance from "./axiosConfig";
import { Product } from "../types/product";

interface CoursesResponse {
  courses: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Fetch all courses (no pagination)
 */
export const fetchCourses = async (): Promise<Product[]> => {
  try {
    // Request with high limit to get all courses
    const response = await axiosInstance.get<CoursesResponse>("/courses", {
      params: { limit: 10000 },
    });

    // Return courses array
    return response.data.courses || [];
  } catch (error: any) {
    console.error("Error fetching courses:", error);

    // Check if it's a network error
    if (!error.response) {
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy."
      );
    }

    throw error;
  }
};

/**
 * Fetch courses with pagination
 */
export const fetchCoursesPaginated = async (
  page: number = 1,
  limit: number = 12,
  filters?: {
    category?: string;
    level?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
  }
): Promise<CoursesResponse> => {
  try {
    const response = await axiosInstance.get<CoursesResponse>("/courses", {
      params: {
        page,
        limit,
        ...filters,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated courses:", error);
    throw error;
  }
};

/**
 * Fetch course by ID
 */
export const fetchCourseById = async (id: string): Promise<Product> => {
  try {
    const response = await axiosInstance.get<Product>(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    throw error;
  }
};

/**
 * Search courses
 */
export const searchCourses = async (query: string): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get<CoursesResponse>("/courses", {
      params: { search: query, limit: 1000 },
    });
    return response.data.courses || [];
  } catch (error) {
    console.error("Error searching courses:", error);
    throw error;
  }
};

/**
 * Get featured/bestseller courses
 */
export const fetchFeaturedCourses = async (): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get<Product[]>("/courses/featured");
    return response.data;
  } catch (error) {
    console.error("Error fetching featured courses:", error);
    throw error;
  }
};
