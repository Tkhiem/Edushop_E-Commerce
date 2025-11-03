import React from "react";
import { StarRating } from "@/components/ui/StarRating";
import { type Review } from "./ReviewItem";

interface Props {
  reviews: Review[];
}

const ReviewSummary: React.FC<Props> = ({ reviews }) => {
  if (reviews.length === 0) return null;

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <StarRating rating={avgRating} />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {avgRating.toFixed(1)} / 5 ({reviews.length} đánh giá)
        </span>
      </div>
    </div>
  );
};

export default ReviewSummary;
