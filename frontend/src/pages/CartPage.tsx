import { fetchSuggestions } from "@/api/suggestions";
import emptyCartSVG from "@/assets/cart.svg";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { HorizontalScroller } from "@/components/common/HorizontalScroller";
import EmptyState from "@/components/EmptyState";
import ProductCardMobile from "@/components/product/ProductCardMobile";
import ProductDetailModal from "@/components/product/ProductDetailModal";
import Button from "@/components/ui/Button";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useCart } from "@/context/CartProvider";
import { useProductActions } from "@/hooks/useProductActions";
import type { Product } from "@/types/product";
import {
  calculateDiscountPercentage,
  calculateOriginalTotal,
} from "@/utils/cart";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CartPage: React.FC = () => {
  const { items, removeFromCart, total } = useCart();
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const [loading, setLoading] = useState(false);

  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  const {
    handleToggleFavorite,
    handleViewDetail,
    isFavorite,
    selectedProduct,
    setSelectedProduct,
  } = useProductActions();

  const originalTotal = calculateOriginalTotal(items);
  const discountPercentage = calculateDiscountPercentage(originalTotal, total);

  useEffect(() => {
    setIsSuggesting(true);
    const fetchData = async () => {
      try {
        const res = await fetchSuggestions("id-10101", "cart");

        setTimeout(() => {
          setSuggestions(res);
          setIsSuggesting(false);
        }, 1000);
      } catch {
        toast.error("Không thể lấy gợi ý lúc này");
        setIsSuggesting(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="container mx-auto md:py-6 md:px-4">
      {items.length > 0 && (
        <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">Giỏ hàng</h1>
      )}

      {items.length === 0 ? (
        <EmptyState
          imageSrc={emptyCartSVG}
          title="Giỏ hàng trống"
          description="Bạn chưa có sản phẩm nào trong giỏ."
          cta={
            <Link to="/">
              <Button variant="primary">Tiếp tục mua sắm</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          {/* Danh sách sản phẩm */}
          <div className="flex-1 space-y-4">
            <h2 className="font-semibold text-lg dark:text-gray-100">
              {items.length} khóa học trong giỏ hàng
            </h2>

            {loading
              ? Array.from({ length: items.length }).map((_, i) => (
                  <CartItem key={`skeleton-${i}`} loading />
                ))
              : items.map(({ product }) => (
                  <CartItem
                    key={product.id}
                    product={product}
                    onRemove={removeFromCart}
                  />
                ))}
          </div>

          <div className="w-full md:w-1/3">
            <CartSummary
              total={total}
              originalTotal={originalTotal}
              discountPercentage={discountPercentage}
              loading={loading}
            />
          </div>
        </div>
      )}

      {!isMobile && items.length > 0 && (
        <div className="mt-3">
          <h3 className="font-bold text-lg dark:text-gray-100">
            Có thể bản quan tâm
          </h3>
          <HorizontalScroller className="mt-4">
            {isSuggesting
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={`loading-${i}`}
                    className="min-w-[300px] max-w-[300px] flex-shrink-0 mb-4"
                  >
                    <ProductCardMobile loading />
                  </div>
                ))
              : suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="min-w-[250px] max-w-[300px] flex-shrink-0 mb-8"
                  >
                    <ProductCardMobile
                      product={product}
                      onDetailClick={handleViewDetail}
                      onLikeClick={handleToggleFavorite}
                      isLiked={isFavorite(product.id)}
                    />
                  </div>
                ))}
          </HorizontalScroller>
        </div>
      )}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          isLiked={isFavorite(selectedProduct.id)}
          onLikeClick={handleToggleFavorite}
        />
      )}
    </div>
  );
};

export default CartPage;
