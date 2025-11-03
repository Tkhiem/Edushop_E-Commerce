import React from "react";
import clsx from "clsx";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  outline?: boolean;
  ghost?: boolean;
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const getVariantClass = (
  variant: string,
  outline?: boolean,
  ghost?: boolean
) => {
  if (ghost) {
    switch (variant) {
      case "primary":
        return "text-primary hover:bg-primary/10 dark:hover:bg-primary/20";
      case "secondary":
        return "text-secondary hover:bg-secondary/10 dark:hover:bg-secondary/20";
      case "danger":
        return "text-danger hover:bg-danger/10 dark:hover:bg-danger/20";
      default:
        return "";
    }
  }

  if (outline) {
    switch (variant) {
      case "primary":
        return "border border-primary text-primary bg-transparent hover:bg-primary/10 dark:hover:bg-primary/20";
      case "secondary":
        return "border border-secondary text-secondary bg-transparent hover:bg-secondary/10 dark:hover:bg-secondary/20";
      case "danger":
        return "border border-danger text-danger bg-transparent hover:bg-danger/10 dark:hover:bg-danger/20";
      default:
        return "";
    }
  }

  switch (variant) {
    case "primary":
      return "bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary-hover";
    case "secondary":
      return "bg-secondary text-secondary-foreground hover:bg-secondary-hover dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary-hover";
    case "danger":
      return "bg-danger text-danger-foreground hover:bg-danger-hover dark:bg-danger dark:text-danger-foreground dark:hover:bg-danger-hover";
    default:
      return "";
  }
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  className = "",
  outline = false,
  ghost = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-offset-2",
        getVariantClass(variant, outline, ghost),
        sizeClasses[size],
        {
          "opacity-50 cursor-not-allowed": disabled || loading,
          "animate-pulse": loading,
        },
        className
      )}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 mr-2 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        <>
          {iconLeft && <span className="mr-1">{iconLeft}</span>}
          <span>{children}</span>
          {iconRight && <span className="ml-1">{iconRight}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
