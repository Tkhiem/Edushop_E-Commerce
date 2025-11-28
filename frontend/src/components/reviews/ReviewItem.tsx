import React from "react";
import StarRating from "../ui/StarRating";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful?: number;
}

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <img
          src={
            review.userAvatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              review.userName
            )}&background=0D8ABC&color=fff`
          }
          alt={review.userName}
          className="w-12 h-12 rounded-full object-cover"
        />

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">{review.userName}</h4>
            <span className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>

          <StarRating rating={review.rating} size="small" />

          <p className="mt-3 text-gray-700 leading-relaxed">{review.comment}</p>

          {/* Helpful Button */}
          {review.helpful !== undefined && (
            <div className="mt-4">
              <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                👍 Helpful ({review.helpful})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
