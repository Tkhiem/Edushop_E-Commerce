import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { CartItem } from "../types/cart";
import axios from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Fetch cart from API when user is authenticated
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get("/carts");
      
      if (response.data.success) {
        // Convert backend format to frontend format
        const cartItems: CartItem[] = response.data.data.items.map(
          (item: any) => {
            // course_id can be either a string (ObjectId) or a populated object
            let mappedId: string = '';
            let courseData = null;
            
            if (typeof item.course_id === 'object' && item.course_id !== null) {
              // course_id is a populated object from MongoDB
              courseData = item.course_id;
              
              // MongoDB documents from Mongoose have _id as a string in JSON
              mappedId = courseData._id || courseData.id || '';
              
              // Ensure it's a string
              if (mappedId && typeof mappedId !== 'string') {
                mappedId = String(mappedId);
              }
            } else if (typeof item.course_id === 'string') {
              // course_id is just the ObjectId string
              mappedId = item.course_id;
            }
            
            return {
              id: mappedId,
              title: courseData?.title || item.title,
              price: courseData?.price || item.price,
              discountedPrice: courseData?.price || item.price,
              thumbnail: courseData?.thumbnail || item.thumbnail,
              instructor: courseData?.instructor || item.instructor,
              category: courseData?.category || item.category,
              rating: courseData?.rating,
              students: courseData?.students,
              quantity: item.quantity || 1,
            };
          }
        );
        
        setItems(cartItems);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart when user changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, user]);

  const addToCart = async (item: CartItem) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    try {
      const response = await axios.post("/carts/add", {
        courseId: item.id,
      });

      if (response.data.success) {
        await fetchCart(); // Refresh cart
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng";
      alert(message);
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await axios.delete(`/carts/remove/${productId}`);
      
      if (response.data.success) {
        await fetchCart(); // Refresh cart
      }
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      const message = error.response?.data?.message || "Lỗi khi xóa khỏi giỏ hàng";
      alert(message);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // For courses, we don't really update quantity
    // This is kept for compatibility
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      await axios.delete("/carts/clear");
      setItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Lỗi khi xóa giỏ hàng");
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.discountedPrice || item.price || 0;
      return total + price * (item.quantity || 1);
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isLoading,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
