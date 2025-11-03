import axios from "./axiosConfig";
import { Course } from "./courses.api";

export interface FavoritesResponse {
  success: boolean;
  data: Course[];
}

// Get favorites
export const getFavorites = async (): Promise<FavoritesResponse> => {
  const response = await axios.get("/favorites");
  return response.data;
};

// Add to favorites
export const addToFavorites = async (
  courseId: number
): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post("/favorites", { course_id: courseId });
  return response.data;
};

// Remove from favorites
export const removeFromFavorites = async (
  courseId: number
): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`/favorites/${courseId}`);
  return response.data;
};
