import axios from "./axiosConfig";

export interface Course {
  course_id: number;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  thumbnail_url: string;
  price: number;
  discounted_price: number;
  level: string;
  language: string;
  duration_minutes: number;
  category_name: string;
  category_slug: string;
  instructor_name: string;
  instructor_avatar: string;
  // Thêm các field này nếu backend trả về
  instructor_email?: string;
  instructor_bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CoursesResponse {
  success: boolean;
  data: Course[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getCourses = async (params?: {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<CoursesResponse> => {
  const response = await axios.get("/courses", { params });
  return response.data;
};

export const getCourseById = async (
  id: number
): Promise<{ success: boolean; data: Course }> => {
  const response = await axios.get(`/courses/${id}`);
  return response.data;
};
