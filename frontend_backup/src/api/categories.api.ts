import axios from "./axiosConfig";

export interface Category {
  category_id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export const getCategories = async (): Promise<CategoriesResponse> => {
  const response = await axios.get("/categories");
  return response.data;
};

export const getCategoryBySlug = async (
  slug: string
): Promise<{ success: boolean; data: Category }> => {
  const response = await axios.get(`/categories/${slug}`);
  return response.data;
};
