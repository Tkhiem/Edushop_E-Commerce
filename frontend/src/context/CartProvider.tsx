import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Product } from "@/types/product";
import {
  getCartByUser,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
} from "@/api/carts.api";
import { toast } from "sonner";

interface CartItem {
  product: Product;
  quantity: number;
  cartItemId?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock userId (sau này lấy từ AuthContext)
  const userId = "user_123";

  // Load cart từ localStorage khi component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage khi items thay đổi
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items));
    } else {
      localStorage.removeItem("cart");
    }
  }, [items]);

  const addToCart = (product: Product) => {
    const existingItem = items.find((item) => item.product.id === product.id);

    if (existingItem) {
      // Tăng quantity
      setItems(
        items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      toast.success("Đã tăng số lượng trong giỏ hàng");
    } else {
      // Thêm mới
      setItems([...items, { product, quantity: 1 }]);
      toast.success("Đã thêm vào giỏ hàng");
    }

    // TODO: Sync với backend
    // apiAddToCart({ userId, productId: product.id, quantity: 1 });
  };

  const removeFromCart = (productId: string) => {
    setItems(items.filter((item) => item.product.id !== productId));
    toast.success("Đã xóa khỏi giỏ hàng");

    // TODO: Sync với backend
    // const item = items.find(i => i.product.id === productId);
    // if (item?.cartItemId) {
    //   apiRemoveFromCart(item.cartItemId);
    // }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Đã xóa toàn bộ giỏ hàng");
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
