// src/components/common/SearchBar.tsx
import { FiSearch } from "react-icons/fi";
import { Input } from "../ui/Input";

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export const SearchBar = ({
  placeholder = "Tìm kiếm...",
  value = "",
  onChange,
}: SearchBarProps) => {
  return (
    <div className="relative w-full md:min-w-sm">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500">
        <FiSearch />
      </span>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {/* <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      /> */}
    </div>
  );
};
