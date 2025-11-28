import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "small" | "medium" | "large";
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
  padding = "medium",
}) => {
  const paddingClasses = {
    none: "",
    small: "p-4",
    medium: "p-6",
    large: "p-8",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md ${
        hover ? "hover:shadow-xl transition-shadow duration-300" : ""
      } ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
