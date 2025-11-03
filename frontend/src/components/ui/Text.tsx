import React from "react";
import clsx from "clsx";

export type TextProps = {
  text: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  iconClassName?: string;
};

const Text: React.FC<TextProps> = ({
  text,
  icon,
  iconPosition = "left",
  className = "",
  iconClassName = "",
}) => {
  if (!icon) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={clsx(
        "inline-flex gap-1",
        iconPosition === "right"
          ? "flex-row-reverse items-start"
          : "items-start",
        className
      )}
    >
      <span className={clsx("mt-1", iconClassName)}>{icon}</span>
      <span>{text}</span>
    </span>
  );
};

export default Text;
