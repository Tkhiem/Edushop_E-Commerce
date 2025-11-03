import React from "react";

interface EmptyStateProps {
  imageSrc?: string;
  title?: string;
  description?: string;
  cta?: React.ReactNode;
  className?: string;
  imageClassName?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  imageSrc,
  title,
  description,
  cta,
  className = "",
  imageClassName,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-4 h-full ${className}`}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Empty"
          className={`object-contain mb-4 opacity-80 ${
            imageClassName ?? "w-56 h-56 md:w-64 md:h-64"
          }`}
        />
      )}
      {title && (
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {title}
        </h2>
      )}

      {description && (
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-4 text-sm">
          {description}
        </p>
      )}

      {cta && <div className="mt-2">{cta}</div>}
    </div>
  );
};

export default EmptyState;
