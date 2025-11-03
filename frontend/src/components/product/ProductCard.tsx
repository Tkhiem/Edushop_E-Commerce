import { useState } from "react";
import ProductDetailModal from "./ProductDetailModal";
import ImagePlaceholder from "../ui/ImagePlaceholder";

interface ProductCardProps {
  id: number;
  title: string;
  image: string;
  price: number | string;
  discountPrice: number | string;
  rating: number;
  students: number;
  instructor: string;
  level: string;
}

export default function ProductCard({
  id,
  title,
  image,
  price,
  discountPrice,
  rating,
  students,
  instructor,
  level,
}: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Convert to number safely
  const priceNum = typeof price === "number" ? price : parseFloat(price) || 0;
  const discountPriceNum =
    typeof discountPrice === "number"
      ? discountPrice
      : parseFloat(discountPrice) || 0;

  return (
    <>
      <div
        className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer bg-white"
        onClick={() => setShowModal(true)}
      >
        {/* Image */}
        <div className="relative bg-gray-200 h-48">
          {!image || imgError ? (
            <ImagePlaceholder width={480} height={270} text="No Image" />
          ) : (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-md text-xs font-bold">
            Bestseller
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3.5rem]">
            {title}
          </h3>

          <p className="text-sm text-gray-600 mb-2">By {instructor}</p>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-500 font-bold">
              {rating.toFixed(1)}
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-500 text-xs">
              ({students.toLocaleString()})
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-green-600">
              ${discountPriceNum.toFixed(2)}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ${priceNum.toFixed(2)}
            </span>
            <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
              {priceNum > 0
                ? Math.round(((priceNum - discountPriceNum) / priceNum) * 100)
                : 0}
              % OFF
            </span>
          </div>

          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
            {level}
          </span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ProductDetailModal courseId={id} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
