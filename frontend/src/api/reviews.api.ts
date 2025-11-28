import axiosInstance from "./axiosConfig";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful?: number;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
}

export interface ReviewResponse {
  success: boolean;
  data: Review;
}

// Get reviews by course ID
export const getReviewsByCourse = async (
  courseId: string,
  limit?: number
): Promise<Review[]> => {
  try {
    const { data } = await axiosInstance.get<ReviewsResponse>(
      `/reviews/course/${courseId}`,
      { params: { limit } }
    );
    return data.data;
  } catch (error) {
    console.error(`❌ Error fetching reviews for course ${courseId}:`, error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

// Add a new review
export const addReview = async (
  courseId: string,
  rating: number,
  comment: string
): Promise<Review> => {
  try {
    const { data } = await axiosInstance.post<ReviewResponse>("/reviews", {
      courseId,
      rating,
      comment,
    });
    return data.data;
  } catch (error) {
    console.error("❌ Error adding review:", error);
    throw error;
  }
};

// Update a review
export const updateReview = async (
  reviewId: string,
  rating: number,
  comment: string
): Promise<Review> => {
  try {
    const { data } = await axiosInstance.put<ReviewResponse>(
      `/reviews/${reviewId}`,
      { rating, comment }
    );
    return data.data;
  } catch (error) {
    console.error("❌ Error updating review:", error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/reviews/${reviewId}`);
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    throw error;
  }
};

// Mark review as helpful
export const markReviewHelpful = async (reviewId: string): Promise<void> => {
  try {
    await axiosInstance.post(`/reviews/${reviewId}/helpful`);
  } catch (error) {
    console.error("❌ Error marking review as helpful:", error);
    throw error;
  }
};

// Export as default object
export const reviewsApi = {
  getReviewsByCourse,
  addReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
};

export default reviewsApi;
