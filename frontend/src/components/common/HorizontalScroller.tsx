// src/components/common/HorizontalScroller.tsx

import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type HorizontalScrollerProps = {
  children: React.ReactNode;
  itemWidth?: number;
  className?: string;
};

export const HorizontalScroller = ({
  children,
  itemWidth = 300,
  className = "",
}: HorizontalScrollerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 1
    );
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -itemWidth : itemWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateScrollButtons();
    const handleScroll = () => updateScrollButtons();

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [children]);

  return (
    <div className={`relative ${className}`}>
      {canScrollLeft && (
        <button
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white p-4 shadow rounded-full hidden sm:flex"
          onClick={() => scroll("left")}
        >
          <FaChevronLeft />
        </button>
      )}

      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth custom-scrollbar-x"
      >
        <div className="flex gap-4 flex-nowrap">{children}</div>
      </div>

      {canScrollRight && (
        <button
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white p-4 shadow rounded-full hidden sm:flex"
          onClick={() => scroll("right")}
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};
