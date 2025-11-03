import React from "react";
import clsx from "clsx";
import { FiCheckCircle, FiCircle } from "react-icons/fi"; // Icon đẹp

export type RadioProps = {
  name: string;
  label: React.ReactNode;
  value: string;
  checkedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export const Radio: React.FC<RadioProps> = ({
  name,
  label,
  value,
  checkedValue,
  onChange,
  disabled = false,
  className = "",
}) => {
  const isChecked = checkedValue === value;

  return (
    <label
      className={clsx(
        "flex items-center gap-2 cursor-pointer select-none p-1 rounded-md transition",
        isChecked
          ? " text-primary"
          : "border-gray-300 hover:bg-gray-100 hover:dark:bg-gray-400",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onClick={() => {
          if (isChecked) {
            onChange("");
          }
        }}
        onChange={() => {
          if (!isChecked) {
            onChange(value);
          }
        }}
        disabled={disabled}
        className="hidden"
      />

      {isChecked ? (
        <FiCheckCircle className="text-primary w-5 h-5" />
      ) : (
        <FiCircle className="text-gray-400 w-5 h-5 dark:text-gray-100" />
      )}

      <span className="text-sm">{label}</span>
    </label>
  );
};
