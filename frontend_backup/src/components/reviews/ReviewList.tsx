import React from "react";
import { ReviewItem, type Review } from "./ReviewItem";

interface Props {
  reviews: Review[];
}

const ReviewList: React.FC<Props> = ({ reviews }) => {
  if (reviews.length === 0) {
    return <p className="text-sm text-gray-500">Chưa có đánh giá nào.</p>;
  }

  return (
    <div className="space-y-3 pr-2 max-h-60 custom-scrollbar">
      {reviews.map((review, idx) => (
        <ReviewItem key={idx} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
