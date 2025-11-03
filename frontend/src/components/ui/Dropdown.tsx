import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { FaChevronDown } from "react-icons/fa";
import { Button, type ButtonProps } from "./Button";

export type DropdownOption = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

type DropdownProps = {
  options: DropdownOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  selectedValue?: string;
  disabled?: boolean;
} & Omit<ButtonProps, "onClick" | "children">;

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  placeholder = "Chọn một mục",
  selectedValue,
  disabled = false,
  variant = "primary",
  size = "md",
  className,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        variant={variant}
        size={size}
        outline
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        className={clsx("min-w-[160px] px-4", className)}
        {...rest}
      >
        <div className="flex w-full items-center">
          <span className="flex-grow text-left truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <FaChevronDown className="w-3 h-3 ml-12 shrink-0" />
        </div>
      </Button>

      {open && (
        <div className="absolute z-10 mt-2 w-full rounded-md shadow-lg bg-white dark:bg-neutral-800 dark:text-gray-200 ring-1 ring-white ring-opacity-5">
          <ul className="py-1 max-h-64 overflow-y-auto">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
                className={clsx(
                  "cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-2",
                  option.value === selectedValue &&
                    "font-medium bg-gray-100 dark:bg-neutral-700"
                )}
              >
                {option.icon && (
                  <span className="text-base">{option.icon}</span>
                )}
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
