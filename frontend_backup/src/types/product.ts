export interface Product {
  id: string;
  name: string;
  type: "Lớp học" | "Tài liệu" | "Công cụ";
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  longDescription: string;
  instructor: string;
  duration: string;
  rating: number;
  countRating: number;
  language: string;
  tags: string[];
  features: string[];
}

export interface ViewedProductEntry {
  product: Product;
  viewedTimes: number;
  lastViewedAt: string;
  history: string[]; // timestamp history
}
