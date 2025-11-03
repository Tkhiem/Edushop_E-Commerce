// components/ui/Skeleton.tsx
import React from "react";
import clsx from "clsx";

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = "w-full",
  height = "h-4",
  rounded = "rounded",
  className = "",
}) => {
  return (
    <div
      className={clsx(
        "bg-gray-300 dark:bg-gray-600 animate-pulse",
        width,
        height,
        rounded,
        className
      )}
    />
  );
};

export default Skeleton;
