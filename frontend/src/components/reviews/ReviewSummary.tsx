import React from "react";
import StarRating from "../ui/StarRating";

interface ReviewSummaryProps {
  rating: number;
  totalReviews: number;
  ratingDistribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  rating,
  totalReviews,
  ratingDistribution,
}) => {
  const distribution = ratingDistribution || {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center gap-8">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {rating.toFixed(1)}
          </div>
          <StarRating rating={rating} size="large" />
          <p className="mt-2 text-sm text-gray-600">
            {totalReviews.toLocaleString()} reviews
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 w-8">
                {star} ★
              </span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{
                    width: `${getPercentage(
                      distribution[star as keyof typeof distribution]
                    )}%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {getPercentage(distribution[star as keyof typeof distribution])}
                %
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
