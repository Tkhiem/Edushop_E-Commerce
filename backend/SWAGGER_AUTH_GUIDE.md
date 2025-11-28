# 🔐 Hướng dẫn sử dụng Swagger UI với Authentication

## ⚠️ Vấn đề: Lỗi 401 Unauthorized trên Swagger UI

Khi test API endpoints yêu cầu authentication (POST, PUT, DELETE) trên Swagger UI, bạn sẽ gặp lỗi:

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**Nguyên nhân:** Swagger UI không tự động gửi JWT token khi gọi API.

---

## ✅ Giải pháp: Thêm JWT Token vào Swagger UI

### Bước 1: Lấy JWT Token cho Admin

Chạy script để lấy token:

```bash
cd backend
node scripts/getAdminToken.js
```

Script sẽ hiển thị token có dạng:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTEyYWE0ZjU1ZGRkZDQ1ZWMzMmYyNjIi...
```

### Bước 2: Cấu hình Swagger UI

1. **Mở Swagger UI**: `http://localhost:5000/api-docs`

2. **Click nút "Authorize"** (🔓) ở góc trên bên phải màn hình

3. **Nhập token vào ô "Value"**:
   - ⚠️ **QUAN TRỌNG**: Chỉ paste TOKEN, KHÔNG thêm chữ "Bearer"
   - ❌ **SAI**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ✅ **ĐÚNG**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Swagger UI sẽ TỰ ĐỘNG thêm "Bearer " vào header

4. **Click "Authorize"** rồi **"Close"**

5. **Test API**: Giờ bạn có thể test các endpoint cần authentication

---

## 📝 Test API tạo khóa học (POST /api/courses)

### Request Body mẫu:

```json
{
  "title": "Lập trình React từ cơ bản đến nâng cao",
  "slug": "lap-trinh-react-tu-co-ban-den-nang-cao-abc123",
  "description": "Khóa học React toàn diện",
  "thumbnail": "https://example.com/react-course.jpg",
  "price": 50,
  "originalPrice": 100,
  "discountPercentage": 50,
  "category": "Lập Trình Web",
  "instructor": "Nguyễn Văn A",
  "level": "beginner",
  "language": "English",
  "duration": 10.5,
  "lectures": 50,
  "isBestseller": true,
  "tags": ["react", "javascript", "frontend"]
}
```

### Expected Response (201 Created):

```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "_id": "673c...",
    "title": "Lập trình React từ cơ bản đến nâng cao",
    "price": 50,
    ...
  }
}
```

---

## 🔄 Token hết hạn?

Token có hiệu lực **7 ngày**. Nếu hết hạn, chạy lại:

```bash
node scripts/getAdminToken.js
```

Và cập nhật token mới trên Swagger UI.

---

## 🛠️ Alternative: Test với Postman/Thunder Client

Nếu bạn sử dụng Postman hoặc Thunder Client:

1. **Headers**:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ⚠️ **CÓ** thêm chữ "Bearer" phía trước token

2. **Request**:
   - Method: `POST`
   - URL: `http://localhost:5000/api/courses`
   - Body: JSON (xem mẫu ở trên)

---

## 📌 Lưu ý quan trọng

1. **Frontend vs Backend**:
   - ✅ Frontend (React) tự động gửi token qua `axiosConfig.ts`
   - ❌ Swagger UI cần cấu hình thủ công

2. **Slug phải unique**:
   - Mỗi lần test thêm khóa học, đổi slug khác nhau
   - Ví dụ: `lap-trinh-react-abc123`, `lap-trinh-react-def456`

3. **Price trong database là USD**:
   - Frontend hiển thị VNĐ (x24,000)
   - Backend lưu USD
   - Swagger test với USD

---

## ❓ Troubleshooting

### Vẫn bị lỗi 401?
- ✅ Kiểm tra đã click "Authorize" chưa
- ✅ Xem icon 🔓 đã chuyển sang 🔒 chưa
- ✅ Token có đúng format không (không có khoảng trắng, không có "Bearer")
- ✅ Kiểm tra curl command: phải là `Bearer <token>` không phải `Bearer Bearer <token>`
- ✅ Nếu vẫn lỗi, logout khỏi Swagger (click 🔒 → Logout) và authorize lại

### Lỗi "slug already exists"?
- ✅ Đổi slug sang giá trị khác
- ✅ Hoặc xóa khóa học cũ trước

### Lỗi validation?
- ✅ Kiểm tra các trường bắt buộc: `title`, `slug`, `category`, `instructor`, `price`
- ✅ `language` phải là: "English", "Vietnamese", "Chinese", "Japanese"
- ✅ `level` phải là: "beginner", "intermediate", "advanced", "all levels"

---

## 🎯 Tóm tắt

1. Chạy: `node scripts/getAdminToken.js`
2. Copy token
3. Mở Swagger UI: `http://localhost:5000/api-docs`
4. Click 🔓 "Authorize"
5. Paste token (không có "Bearer")
6. Click "Authorize" → "Close"
7. Test API endpoints! 🚀
