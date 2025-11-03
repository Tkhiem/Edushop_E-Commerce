import React from "react";
import clsx from "clsx";

export type CardProps = {
  title?: string;
  description?: string;
  image?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  rounded?: boolean;
  shadow?: boolean;
  hoverable?: boolean;
};

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  footer,
  children,
  className = "",
  rounded = true,
  shadow = true,
  hoverable = true,
}) => {
  return (
    <div
      className={clsx(
        "bg-background text-foreground border border-border transition-all duration-200",
        rounded && "rounded-lg",
        shadow && "shadow-md",
        hoverable && "hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className={clsx(
            "w-full object-cover",
            rounded && "rounded-t-lg",
            "max-h-60"
          )}
        />
      )}
      <div className="p-4">
        {title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
        {description && (
          <p className="text-sm text-muted mb-2">{description}</p>
        )}
        {children}
      </div>
      {footer && (
        <div className="px-4 py-2 border-t border-border">{footer}</div>
      )}
    </div>
  );
};
