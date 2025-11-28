import React from "react";
import { CartItem as CartItemType } from "../../types/cart";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../utils/currency";
import StarRating from "../ui/StarRating";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemove?: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, newQuantity);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = async () => {
    try {
      if (onRemove) {
        await onRemove(item.id);
      } else {
        await removeFromCart(item.id);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Calculate subtotal (price is in USD from backend)
  const subtotal = item.price * item.quantity;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Category */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
            <span className="text-sm text-blue-600 font-medium">
              {item.category}
            </span>
          </div>

          {/* Instructor */}
          <p className="text-sm text-gray-600 mb-2">By {item.instructor}</p>

          {/* Rating & Students */}
          {item.rating && (
            <div className="flex items-center gap-3 mb-3">
              <StarRating rating={item.rating} size="small" />
              {item.students && (
                <span className="text-sm text-gray-600">
                  ({item.students.toLocaleString()} students)
                </span>
              )}
            </div>
          )}

          {/* Price & Actions */}
          <div className="flex items-center justify-between">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(item.price)}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(item.originalPrice)}
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 font-medium text-gray-900">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={handleRemove}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Remove from cart"
                title="Xóa khỏi giỏ hàng"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Subtotal */}
          {item.quantity > 1 && (
            <div className="mt-2 text-right">
              <span className="text-sm text-gray-600">Subtotal: </span>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(subtotal)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
