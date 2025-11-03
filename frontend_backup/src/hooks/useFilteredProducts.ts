import { useMemo } from "react";
import type { Product } from "@/types/product";
import type { FilterState } from "@/types/filter";

export type SortOption = "priceAsc" | "priceDesc" | "ratingDesc" | "newest";

export const useFilteredProducts = (
  products: Product[],
  filters: FilterState,
  searchText: string,
  sort: SortOption,
  currentPage: number,
  pageSize: number
) => {
  const filtered = useMemo(() => {
    const priceRanges: Record<string, (price: number) => boolean> = {
      "Dưới 500,000₫": (price) => price < 500000,
      "500,000₫ - 1,000,000₫": (price) => price >= 500000 && price <= 1000000,
      "1,000,000₫ - 2,000,000₫": (price) => price > 1000000 && price <= 2000000,
      "Trên 2,000,000₫": (price) => price > 2000000,
    };

    return products.filter((product) => {
      // Tìm kiếm
      if (
        searchText &&
        !product.name.toLowerCase().includes(searchText.toLowerCase())
      )
        return false;

      // Loại
      if (
        filters.type &&
        filters.type.length &&
        !filters.type.includes(product.type)
      )
        return false;

      // Chủ đề
      if (
        filters.category &&
        filters.category.length &&
        !filters.category.includes(product.category)
      )
        return false;

      // Trình độ
      if (
        filters.level &&
        filters.level.length &&
        !filters.level.includes(product.level)
      )
        return false;

      // if (
      //   filters.price &&
      //   (product.price < filters.price[0] || product.price > filters.price[1])
      // )
      //   return false;

      // Giá
      if (
        filters.price &&
        filters.price.length > 0 &&
        !filters.price.some((rangeLabel) =>
          priceRanges[rangeLabel]?.(product.price)
        )
      ) {
        return false;
      }

      // Rating
      if (
        filters.rating !== undefined &&
        !isNaN(Number(filters.rating)) &&
        product.rating < Number(filters.rating)
      )
        return false;

      return true;
    });
  }, [products, filters, searchText]);

  const sorted = useMemo(() => {
    switch (sort) {
      case "priceAsc":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "priceDesc":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "ratingDesc":
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case "newest":
      default:
        return filtered;
    }
  }, [filtered, sort]);

  const total = sorted.length;
  const paginated = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return { products: paginated, total };
};
