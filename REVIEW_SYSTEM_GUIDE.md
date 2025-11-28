# 🌟 Hệ thống Đánh giá Khóa học - Hướng dẫn

## ✅ Đã hoàn thành

### 📝 Frontend - User Interface

1. **ReviewForm.tsx** - Form để user viết đánh giá
   - Chọn rating 1-5 sao với hiệu ứng hover
   - Textarea nhập comment (tối thiểu 10 ký tự)
   - Validate: phải login, chưa review course này trước đó
   - Hiển thị lỗi và loading state

2. **CourseDetailPage.tsx** - Tích hợp reviews
   - Hiển thị form review (chỉ khi user đã mua khóa học)
   - Hiển thị danh sách reviews từ học viên
   - Auto reload sau khi submit review thành công

3. **AdminReviews.tsx** - Quản lý reviews (Admin only)
   - Hiển thị tất cả reviews trong hệ thống
   - Thông tin: khóa học, user, rating, comment, ngày tạo
   - Tìm kiếm theo: tên khóa học, user, nội dung
   - Filter theo rating (1-5 sao)
   - Xóa review (chỉ admin)

### 🔧 Backend - API Endpoints

1. **POST /api/reviews** (Yêu cầu authentication)
   - User viết đánh giá mới
   - Input: `course_id`, `rating` (1-5), `comment`
   - Validate: user đã mua course, chưa review trước đó
   - Tự động cập nhật rating trung bình của course

2. **GET /api/reviews/all** (Admin only)
   - Lấy tất cả reviews trong hệ thống
   - Populate: user info (full_name, email), course info (title)
   - Sort: mới nhất trước

3. **DELETE /api/reviews/:id** (Admin only)
   - Xóa review
   - Tự động cập nhật rating của course sau khi xóa

4. **GET /api/reviews/course/:courseId** (Public)
   - Lấy reviews theo course
   - Dùng cho ReviewList component

## 🎯 Luồng hoạt động

### User viết đánh giá:
```
1. User mua khóa học → isOwned = true
2. Vào trang CourseDetailPage
3. Hiển thị ReviewForm (chỉ nếu đã mua)
4. User chọn rating và viết comment
5. Submit → POST /api/reviews với JWT token
6. Backend validate:
   - User đã login?
   - User đã mua course?
   - User chưa review course này?
7. Tạo review mới trong database
8. Cập nhật rating trung bình của course
9. Frontend reload → Hiển thị review mới
```

### Admin quản lý đánh giá:
```
1. Admin login và vào trang "Đánh giá"
2. GET /api/reviews/all → Lấy tất cả reviews
3. Hiển thị table với filters
4. Admin có thể:
   - Tìm kiếm review
   - Filter theo rating
   - Xóa review không phù hợp
5. Khi xóa → DELETE /api/reviews/:id
6. Backend tự động update rating course
```

## 📋 Database Schema

```javascript
Review {
  _id: ObjectId
  course_id: ObjectId (ref: Course)
  user_id: ObjectId (ref: User)
  rating: Number (1-5)
  comment: String
  createdAt: Date
  updatedAt: Date
}
```

## 🔐 Authentication

- **POST /api/reviews**: Yêu cầu JWT token trong header `Authorization: Bearer <token>`
- **GET /api/reviews/all**: Chỉ admin (check `req.user.role === 'admin'`)
- **DELETE /api/reviews/:id**: Chỉ admin

## 🧪 Test Cases

### Test User Review:
1. Login với account customer
2. Mua 1 khóa học
3. Vào trang khóa học
4. Viết review → Phải thấy form
5. Submit review → Success
6. Thử submit lại → Lỗi "You have already reviewed this course"

### Test Admin:
1. Login với account admin
2. Vào trang "Đánh giá"
3. Xem tất cả reviews
4. Test search và filter
5. Xóa 1 review → Success
6. Vào lại trang khóa học → Rating đã update

## 🚀 Cách sử dụng

### 1. Restart Backend
```bash
cd backend
npm run dev
```

### 2. Restart Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Flow:
- Đăng nhập user customer
- Mua khóa học (hoặc fake isOwned = true)
- Vào course detail page
- Viết đánh giá
- Đăng nhập admin
- Vào trang "Đánh giá"
- Xem review vừa tạo

## 📌 Lưu ý

1. **User chỉ review được khóa học đã mua**
   - Check bằng `isOwned` từ useOwnedCourses hook
   - Hoặc check trong backend: user có order chứa course này không

2. **Mỗi user chỉ review 1 lần cho 1 khóa học**
   - Backend đã validate duplicate review

3. **Admin có thể xóa bất kỳ review nào**
   - Không cần check ownership

4. **Rating tự động cập nhật**
   - Mỗi khi có review mới/xóa
   - Tính trung bình rating từ tất cả reviews của course

## 🐛 Troubleshooting

### Lỗi 401 Unauthorized khi POST review:
- Check JWT token trong axiosConfig.ts
- User đã login chưa?

### Không thấy form review:
- User đã mua khóa học chưa?
- Check `isOwned` state

### Admin không thấy reviews:
- Check endpoint `/api/reviews/all`
- Admin đã login chưa?
- Check console log lỗi

## 🎨 UI Components

- **ReviewForm**: Form viết review với star rating
- **ReviewList**: List reviews của 1 course
- **ReviewItem**: 1 review item (đã có sẵn)
- **AdminReviews**: Trang quản lý admin

Tất cả đã được tích hợp vào hệ thống! 🎉
