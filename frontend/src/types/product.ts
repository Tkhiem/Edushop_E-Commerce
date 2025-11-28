export interface Product {
  id: string;
  _id?: string; // ✅ MongoDB ID from backend
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  reviews: number;
  level: string;
  language: string;
  duration: number;
  lectures: number;
  isBestseller: boolean;
  isNew: boolean;
  tags: string[];
  url?: string;
  udemy_id?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseFilters {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  rating?: number;
  instructor?: string;
}

export interface CoursesResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
