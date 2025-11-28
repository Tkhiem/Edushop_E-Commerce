export interface CartItem {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  thumbnail: string;
  price: number;
  discountedPrice: number;
  discountPercentage?: number;
  category: string;
  instructor: string;
  rating?: number;
  students?: number;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
