import React, { useState } from "react";
import { Product } from "../../types/product";
import Modal from "../ui/Modal";
import StarRating from "../ui/StarRating";
import Button from "../ui/Button";
import ReviewList from "../reviews/ReviewList";
import ReviewSummary from "../reviews/ReviewSummary";
import CollapsibleSection from "../ui/CollapsibleSection";

// ✅ CORRECT IMPORTS
import { useCart } from "../../hooks/useCart"; // ← From hooks, NOT context
import { useFavorites } from "../../hooks/useFavorites"; // ← From hooks, NOT context

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCart();
  const { addToFavorites, isFavorite } = useFavorites();
  const [showReviews, setShowReviews] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      slug: product.slug,
      thumbnail: product.thumbnail,
      price: product.price,
      discountedPrice: product.discountedPrice,
      discountPercentage: product.discountPercentage,
      category: product.category,
      instructor: product.instructor,
      rating: product.rating,
      students: product.students,
      quantity: 1,
    });
  };

  const handleAddToFavorites = () => {
    addToFavorites(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Image */}
        <div className="lg:w-1/2">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Right: Details */}
        <div className="lg:w-1/2 flex flex-col">
          {/* Category Badge */}
          <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full w-fit mb-4">
            {product.category}
          </span>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {product.title}
          </h2>

          {/* Rating & Students */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating || 0} />
              <span className="text-sm text-gray-600">
                {product.rating?.toFixed(1)} ({product.reviews || 0} reviews)
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {product.students?.toLocaleString()} students
            </span>
          </div>

          {/* Instructor */}
          <p className="text-gray-600 mb-4">
            Created by{" "}
            <span className="font-medium text-gray-900">
              {product.instructor}
            </span>
          </p>

          {/* Description */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.discountedPrice)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="px-2 py-1 text-sm font-semibold text-white bg-red-500 rounded">
                    -{product.discountPercentage}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              onClick={handleAddToCart}
              variant="primary"
              className="flex-1"
            >
              Add to Cart
            </Button>
            <Button
              onClick={handleAddToFavorites}
              variant={isFavorite(product.id) ? "primary" : "outline"}
              className="px-4"
            >
              <svg
                className="w-5 h-5"
                fill={isFavorite(product.id) ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Button>
          </div>

          {/* Course Info */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Level:</span>
              <span className="font-medium text-gray-900 capitalize">
                {product.level}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Language:</span>
              <span className="font-medium text-gray-900">
                {product.language || "English"}
              </span>
            </div>
            {product.duration && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-900">
                  {Math.floor(product.duration / 60)}h {product.duration % 60}m
                </span>
              </div>
            )}
            {product.lectures && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Lectures:</span>
                <span className="font-medium text-gray-900">
                  {product.lectures}
                </span>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 mt-6 pt-6">
            <CollapsibleSection title="Student Reviews" defaultOpen={false}>
              <ReviewSummary
                rating={product.rating || 0}
                totalReviews={product.reviews || 0}
              />
              <div className="mt-4">
                <ReviewList courseId={product.id} />
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
