export interface Review {
  productId: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export const mockReviews: Review[] = [
  {
    productId: "p001",
    user: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?u=nguyenvana",
    rating: 5,
    comment: "Khóa học rất hay, dễ hiểu và phù hợp với người mới bắt đầu.",
    date: "2024-06-01",
  },
  {
    productId: "p001",
    user: "Trần Thị B",
    avatar: "https://i.pravatar.cc/150?u=tranthib",
    rating: 4.3,
    comment: "Giảng viên giảng dễ hiểu, tài liệu chi tiết.",
    date: "2024-06-02",
  },
  {
    productId: "p001",
    user: "Lê Văn C",
    avatar: "https://i.pravatar.cc/150?u=levanc",
    rating: 3.5,
    comment: "Nội dung ổn nhưng cần cập nhật thêm ví dụ thực tế.",
    date: "2024-06-04",
  },
  {
    productId: "p001",
    user: "Phạm Thị D",
    avatar: "https://i.pravatar.cc/150?u=phamthid",
    rating: 4.8,
    comment: "Khóa học chất lượng, sẽ giới thiệu cho bạn bè.",
    date: "2024-06-05",
  },
  {
    productId: "p001",
    user: "Đỗ Minh E",
    avatar: "https://i.pravatar.cc/150?u=dominhe",
    rating: 2.5,
    comment: "Nội dung còn sơ sài, cần cải thiện thêm.",
    date: "2024-06-06",
  },
  {
    productId: "p002",
    user: "Ngô Thị F",
    avatar: "https://i.pravatar.cc/150?u=ngothif",
    rating: 5,
    comment: "Rất hữu ích, tôi đã áp dụng được ngay.",
    date: "2024-06-03",
  },
  {
    productId: "p002",
    user: "Hoàng Văn G",
    avatar: "https://i.pravatar.cc/150?u=hoangvang",
    rating: 4.2,
    comment: "Nội dung hợp lý, dễ theo kịp.",
    date: "2024-06-08",
  },
  {
    productId: "p002",
    user: "Mai Thị H",
    avatar: "https://i.pravatar.cc/150?u=maithih",
    rating: 3,
    comment: "Giảng viên nói hơi nhanh, cần chậm lại.",
    date: "2024-06-09",
  },
  {
    productId: "p003",
    user: "Phan Văn I",
    avatar: "https://i.pravatar.cc/150?u=phanvani",
    rating: 4.9,
    comment: "Một trong những khóa học tốt nhất tôi từng học.",
    date: "2024-06-10",
  },
  {
    productId: "p003",
    user: "Vũ Thị J",
    avatar: "https://i.pravatar.cc/150?u=vuthij",
    rating: 4.5,
    comment: "Hài lòng với chất lượng khóa học.",
    date: "2024-06-11",
  },
];
