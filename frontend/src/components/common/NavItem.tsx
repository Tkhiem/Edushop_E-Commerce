// src/components/common/NavItem.tsx
import { Link, useLocation } from "react-router-dom";

type NavItemProps = {
  to: string;
  label: string;
};

export const NavItem = ({ to, label }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative inline-block font-medium px-2 py-1
        before:content-[''] before:absolute before:bottom-1
        before:left-[5%] before:h-[35%] before:w-0
        before:bg-primary/15 before:transition-all before:duration-300 before:ease-in-out
        hover:before:w-[100%] hover:text-primary
        ${
          isActive
            ? "text-primary font-semibold before:w-[100%]"
            : "text-black dark:text-gray-200"
        }
      `}
    >
      <span className="relative z-10">{label}</span>
    </Link>
  );
};
