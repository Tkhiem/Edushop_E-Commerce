import React from "react";
import clsx from "clsx";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

type PaginationProps = {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
};

const Pagination: React.FC<PaginationProps> = ({
  total,
  pageSize,
  currentPage,
  onPageChange,
  className = "",
}) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const createPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const pages = createPageNumbers();

  return (
    <div className={clsx("mt-12 space-y-3", className)}>
      {/* Nút trang */}
      <div className="flex items-center justify-center gap-1 flex-wrap">
        <button
          className="p-2 border border-primary rounded-full disabled:opacity-50 hover:bg-primary/20 cursor-pointer"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <MdChevronLeft className="w-5 h-5 text-primary" />
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={clsx(
                "px-3 py-1 text-primary font-bold",
                currentPage === page
                  ? "relative"
                  : "hover:bg-primary/20 rounded cursor-pointer"
              )}
              onClick={() => onPageChange(Number(page))}
            >
              <span
                className={clsx(
                  currentPage === page
                    ? "border-b-2 border-primary inline-block px-1"
                    : ""
                )}
              >
                {page}
              </span>
            </button>
          )
        )}

        <button
          className="p-2 border border-primary rounded-full disabled:opacity-50 hover:bg-primary/20 cursor-pointer"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <MdChevronRight className="w-5 h-5 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
