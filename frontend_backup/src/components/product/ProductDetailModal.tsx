import React from "react";
import type { Product } from "@/types/product";
import { Modal } from "@/components/ui/Modal";
import { StarRating } from "@/components/ui/StarRating";
import { mockReviews } from "@/data/review";
import { CollapsibleSection } from "../ui/CollapsibleSection";
import Button from "../ui/Button";
import ReviewSummary from "../reviews/ReviewSummary";
import ReviewList from "../reviews/ReviewList";
import { toast } from "sonner";
import { useCart } from "@/context/CartProvider";

interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  isLiked?: boolean;
  onLikeClick?: (productId: string) => void;
}

const ProductDetailModal: React.FC<Props> = ({
  product,
  isOpen,
  onClose,
  isLiked,
  onLikeClick,
}) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const reviews = mockReviews.filter((r) => r.productId === product.id);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={
        <span className="text-xl font-semibold dark:text-gray-100">
          {product.name}
        </span>
      }
      footer={
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              onLikeClick?.(product.id);
            }}
            outline={!isLiked}
          >
            {isLiked ? "Đã yêu thích" : "Yêu thích"}
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              addToCart(product);
              toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
            }}
          >
            Thêm vào giỏ
          </Button>
        </div>
      }
      className="sm:max-w-sm md:max-w-lg w-full dark:bg-gray-700"
    >
      <div className="space-y-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-60 object-cover rounded"
        />

        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-[12px] text-gray-400">
            ({product.countRating.toLocaleString()} đánh giá)
          </span>
        </div>

        {/* Giá */}
        <div className="text-lg font-bold text-primary">
          {product.price.toLocaleString()} VND
          {product.originalPrice > product.price && (
            <span className="ml-2 text-sm line-through text-gray-400 font-medium">
              {product.originalPrice.toLocaleString()} VND
            </span>
          )}
        </div>

        {/* Thông tin chi tiết */}
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>
            <strong>Giảng viên:</strong> {product.instructor}
          </li>
          <li>
            <strong>Thời lượng:</strong> {product.duration}
          </li>
          <li>
            <strong>Trình độ:</strong> {product.level}
          </li>
          <li>
            <strong>Ngôn ngữ:</strong> {product.language}
          </li>
        </ul>

        <p className="text-gray-800 dark:text-gray-200">
          {product.longDescription}
        </p>

        <div>
          <CollapsibleSection title="Đặc điểm nổi bật">
            {product.features.length > 0 && (
              <div>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 text-sm">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title="Đánh giá của người học"
            maxHeightPx={200}
            className="mb-12"
            scrollOnExpand
          >
            <ReviewSummary reviews={reviews} />
            <ReviewList reviews={reviews} />
          </CollapsibleSection>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
