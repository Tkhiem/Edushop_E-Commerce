export type FilterType = "radio" | "checkbox" | "slider" | "rating";

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: string[]; // radio, checkbox
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // ₫, giờ, etc
}

export const filterConfig: FilterConfig[] = [
  {
    key: "rating",
    label: "Đánh giá",
    type: "radio",
    options: ["4.5", "4.0", "3.5", "3.0"],
  },
  {
    key: "type",
    label: "Loại",
    type: "checkbox",
    options: ["Lớp học", "Tài liệu", "Công cụ"],
  },
  {
    key: "category",
    label: "Chủ đề",
    type: "checkbox",
    options: [
      "Speaking",
      "TOEIC",
      "IELTS",
      "Grammar",
      "Business English",
      "Kids",
    ],
  },
  {
    key: "level",
    label: "Trình độ",
    type: "checkbox",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    key: "price",
    label: "Khoảng giá",
    type: "checkbox",
    options: [
      "Dưới 500,000₫",
      "500,000₫ - 1,000,000₫",
      "1,000,000₫ - 2,000,000₫",
      "Trên 2,000,000₫",
    ],
  },

  // {
  //   key: "price",
  //   label: "Khoảng giá",
  //   type: "slider",
  //   min: 0,
  //   max: 3000000,
  //   step: 50000,
  //   unit: "₫",
  // },
];
