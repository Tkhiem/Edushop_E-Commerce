import React from "react";
import { Heart, Star, Clock, BarChart2 } from "lucide-react";
import { Product } from "../../types/product";
import { useFavorites } from "../../hooks/useFavorites";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../utils/currency"; // ✅ Import utility

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  const productId = product.id || product._id || "";
  const isLiked = isFavorite(productId);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(product);
  };

  const handleCardClick = () => {
    onClick?.(product);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      await addToCart(product);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // ✅ REMOVED - Use utility instead
  // const formatPrice = (price: number) => { ... }

  const getLevelColor = (level: string) => {
    const levelLower = level.toLowerCase();
    if (levelLower.includes("beginner") || levelLower.includes("cơ bản")) {
      return "bg-green-100 text-green-700";
    }
    if (
      levelLower.includes("intermediate") ||
      levelLower.includes("trung cấp")
    ) {
      return "bg-blue-100 text-blue-700";
    }
    if (levelLower.includes("advanced") || levelLower.includes("nâng cao")) {
      return "bg-purple-100 text-purple-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  const getLevelLabel = (level: string) => {
    const levelLower = level.toLowerCase();
    if (levelLower.includes("beginner")) return "Cơ bản";
    if (levelLower.includes("intermediate")) return "Trung cấp";
    if (levelLower.includes("advanced")) return "Nâng cao";
    if (levelLower.includes("all levels")) return "Tất cả cấp độ";
    return level;
  };

  // ✅ Get default image based on category
  const getDefaultImage = (category: string) => {
    const categoryImages: Record<string, string> = {
      "Lập Trình": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&h=360&fit=crop",
      "Kinh Doanh & Tài Chính": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=360&fit=crop",
      "Thiết Kế Đồ Họa": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=640&h=360&fit=crop",
      "Nhạc Cụ": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=640&h=360&fit=crop",
      "Marketing": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=640&h=360&fit=crop",
      "Photography": "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=640&h=360&fit=crop",
      "Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=640&h=360&fit=crop",
      "Programming": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&h=360&fit=crop",
    };
    
    return categoryImages[category] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&h=360&fit=crop";
  };

  const [imageSrc, setImageSrc] = React.useState(
    product.thumbnail || getDefaultImage(product.category)
  );
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      onClick={handleCardClick}
      data-product-id={productId}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-slate-200 hover-lift"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {!imageError ? (
          <img
            src={imageSrc}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={() => {
              setImageError(true);
              setImageSrc(getDefaultImage(product.category));
            }}
          />
        ) : (
          // Fallback placeholder with icon and category
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white">
            <div className="text-6xl mb-3">
              {product.category === "Lập Trình" && "💻"}
              {product.category === "Kinh Doanh & Tài Chính" && "💼"}
              {product.category === "Thiết Kế Đồ Họa" && "🎨"}
              {product.category === "Nhạc Cụ" && "🎵"}
              {!["Lập Trình", "Kinh Doanh & Tài Chính", "Thiết Kế Đồ Họa", "Nhạc Cụ"].includes(product.category) && "📚"}
            </div>
            <p className="text-sm font-semibold opacity-90">{product.category}</p>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg z-10 group/heart"
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isLiked
                ? "fill-red-500 text-red-500 scale-110"
                : "text-gray-600 group-hover/heart:text-red-500 group-hover/heart:scale-110"
            }`}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isBestseller && (
            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-md">
              Bán chạy
            </span>
          )}
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full shadow-md ${getLevelColor(
              product.level
            )}`}
          >
            {getLevelLabel(product.level)}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-md">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3rem]">
          {product.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-600 mb-3">{product.instructor}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-900">
              {product.rating}
            </span>
            <span className="text-gray-500">({product.reviews || 0})</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart2 className="w-4 h-4" />
            <span>{product.students.toLocaleString()} học viên</span>
          </div>
        </div>

        {/* Duration & Lectures */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{product.duration} phút</span>
          </div>
          <span>•</span>
          <span>{product.lectures} bài giảng</span>
        </div>

        {/* Price & Add to Cart Button - Vertical Layout */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Add to Cart Button - Full Width */}
          <button
            onClick={handleAddToCart}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
