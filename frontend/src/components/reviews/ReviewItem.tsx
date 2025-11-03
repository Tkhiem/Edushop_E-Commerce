import React from "react";
import { StarRating } from "@/components/ui/StarRating";

export interface Review {
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="border-b border-border pb-2 border-gray-300">
      <div className="flex items-center gap-2 mb-1">
        <img
          src={review.avatar}
          alt={review.user}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="text-sm font-medium">{review.user}</p>
          <StarRating rating={review.rating} />
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 italic">
        "{review.comment}"
      </p>
      <p className="text-xs text-gray-400 mt-1">{review.date}</p>
    </div>
  );
};
