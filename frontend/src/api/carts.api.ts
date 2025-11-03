import axios from "./axiosConfig";

export interface CartItem {
  cart_item_id: number;
  course_id: number;
  course_title: string;
  thumbnail_url: string;
  price: number;
  discounted_price: number;
  instructor_name: string;
}

export interface CartResponse {
  success: boolean;
  data: {
    items: CartItem[];
    total: number;
  };
}

// Get cart items
export const getCartItems = async (): Promise<CartResponse> => {
  const response = await axios.get("/carts");
  return response.data;
};

// Add to cart
export const addToCart = async (
  courseId: number
): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post("/carts", { course_id: courseId });
  return response.data;
};

// Remove from cart
export const removeFromCart = async (
  cartItemId: number
): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`/carts/${cartItemId}`);
  return response.data;
};

// Clear cart
export const clearCart = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await axios.delete("/carts");
  return response.data;
};
