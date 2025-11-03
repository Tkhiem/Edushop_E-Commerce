import React from "react";
import clsx from "clsx";

export type InputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  inputClassName?: string;
};

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  onKeyDown,
  disabled = false,
  error,
  iconLeft,
  iconRight,
  className = "",
  inputClassName = "",
}) => {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div
        className={clsx(
          "flex items-center rounded border border-gray-300 transition-all duration-200",
          "bg-background text-foreground",
          error ? "border-danger" : "border-border focus-within:border-primary",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {iconLeft && <span className="pl-3 text-muted">{iconLeft}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            "w-full px-3 py-2 bg-transparent outline-none",
            iconLeft && "pl-1",
            iconRight && "pr-1",
            inputClassName
          )}
        />
        {iconRight && <span className="pr-3 text-muted">{iconRight}</span>}
      </div>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
};
