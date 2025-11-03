import React from "react";
import clsx from "clsx";

export type StarRatingProps = {
  rating: number;
  outOf?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  countRating?: number;
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  outOf = 5,
  size = 14,
  className = "",
  showValue = true,
  countRating,
}) => {
  const stars = Array.from({ length: outOf }, (_, i) => i + 1);
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className={clsx("flex items-center gap-0.5", className)}>
      {showValue && (
        <span className="text-sm text-[#8B430A] dark:text-[#d48240] font-bold mr-1">
          {rating.toFixed(1)}
        </span>
      )}

      {stars.map((star) => {
        const isFull = rounded >= star;
        const isHalf = !isFull && rounded >= star - 0.5;

        return (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={clsx(
              "transition-colors duration-150",
              isFull
                ? "fill-star stroke-star"
                : isHalf
                ? "fill-star stroke-star"
                : "fill-gray-200 stroke-gray-300"
            )}
            style={{ width: size, height: size }}
          >
            <defs>
              <linearGradient id={`half-star-${star}`} x1="0" x2="100%">
                <stop offset="50%" stopColor="#C3710C" />
                <stop offset="50%" stopColor="#fff" />
              </linearGradient>
            </defs>

            <path
              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
              fill={
                isFull
                  ? "#C3710C"
                  : isHalf
                  ? `url(#half-star-${star})`
                  : "#e5e7eb"
              }
            />
          </svg>
        );
      })}

      {countRating && (
        <span className="text-[12px] text-gray-400">
          ({countRating.toLocaleString()})
        </span>
      )}
    </div>
  );
};
