import { useContext } from "react";
import { CartContext } from "../context/CartProvider";

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return {
    cart: context.items,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    getCartTotal: context.getTotalPrice,
    getTotalItems: context.getTotalItems,
    isLoading: context.isLoading,
    fetchCart: context.fetchCart,
  };
};
