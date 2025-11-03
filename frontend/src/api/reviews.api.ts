import axios from "./axiosConfig";

export interface Review {
  review_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
}

// Get reviews for a course
export const getReviews = async (
  courseId: number
): Promise<ReviewsResponse> => {
  const response = await axios.get(`/reviews/${courseId}`);
  return response.data;
};

// Add review
export const addReview = async (
  courseId: number,
  data: { rating: number; comment: string }
): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post("/reviews", {
    course_id: courseId,
    ...data,
  });
  return response.data;
};
