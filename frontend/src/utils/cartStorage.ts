import { CartItem } from "../types/cart";

const CART_STORAGE_KEY = "edushop_cart";

export const getCartItems = (): CartItem[] => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

export const saveCartItems = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const clearCart = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing cart from localStorage:", error);
  }
};

export const addToCart = (item: CartItem): CartItem[] => {
  const items = getCartItems();
  const existingIndex = items.findIndex((i) => i.id === item.id);

  if (existingIndex > -1) {
    items[existingIndex].quantity += item.quantity || 1;
  } else {
    items.push(item);
  }

  saveCartItems(items);
  return items;
};

export const removeFromCart = (productId: string): CartItem[] => {
  const items = getCartItems().filter((item) => item.id !== productId);
  saveCartItems(items);
  return items;
};

export const updateQuantity = (
  productId: string,
  quantity: number
): CartItem[] => {
  const items = getCartItems().map((item) =>
    item.id === productId ? { ...item, quantity } : item
  );
  saveCartItems(items);
  return items;
};
