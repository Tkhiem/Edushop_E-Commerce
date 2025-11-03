export interface FilterState {
  categories: string[];
  levels: string[];
  priceRange: {
    min: number;
    max: number;
  };
  ratings: number[];
  search: string;
  sort: "newest" | "oldest" | "price_asc" | "price_desc";
}