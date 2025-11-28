# EduShop API Documentation

## 📚 Swagger UI - API Documentation

Swagger UI đã được tích hợp vào hệ thống để quản lý và kiểm soát tất cả các API endpoints.

### 🚀 Truy cập Swagger UI

```
http://localhost:5000/api-docs
```

### 📋 Danh sách API Endpoints

#### **Authentication APIs** 🔐
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập vào hệ thống
- `GET /api/auth/me` - Lấy thông tin user hiện tại (yêu cầu JWT token)
- `POST /api/auth/create-admin` - Tạo tài khoản admin

#### **Courses APIs** 📚
- `GET /api/courses` - Lấy danh sách khóa học (có filter, search, sort, pagination)
- `GET /api/courses/search/suggestions` - Gợi ý tìm kiếm
- `GET /api/courses/slug/:slug` - Lấy chi tiết khóa học theo slug
- `GET /api/courses/:id` - Lấy chi tiết khóa học theo ID
- `POST /api/courses` - Tạo khóa học mới (Admin only)
- `PUT /api/courses/:id` - Cập nhật khóa học (Admin only)
- `DELETE /api/courses/:id` - Xóa khóa học (Admin only)

#### **Categories APIs** 🏷️
- `GET /api/categories` - Lấy danh sách tất cả danh mục
- `GET /api/categories/with-counts` - Lấy danh mục kèm số lượng khóa học

#### **Carts APIs** 🛒
- `GET /api/carts` - Lấy giỏ hàng của user (yêu cầu JWT)
- `POST /api/carts/add` - Thêm khóa học vào giỏ hàng (yêu cầu JWT)
- `DELETE /api/carts/remove/:courseId` - Xóa khóa học khỏi giỏ hàng (yêu cầu JWT)
- `PUT /api/carts/update` - Cập nhật số lượng (yêu cầu JWT)
- `DELETE /api/carts/clear` - Xóa toàn bộ giỏ hàng (yêu cầu JWT)

#### **Favorites APIs** ❤️
- `GET /api/favorites/:userId` - Lấy danh sách yêu thích
- `POST /api/favorites/:userId` - Thêm vào danh sách yêu thích
- `DELETE /api/favorites/:userId/:courseId` - Xóa khỏi danh sách yêu thích
- `DELETE /api/favorites/:userId` - Xóa toàn bộ danh sách

#### **Reviews APIs** ⭐
- `GET /api/reviews/course/:courseId` - Lấy đánh giá của một khóa học
- `GET /api/reviews` - Lấy tất cả đánh giá (Admin)
- `POST /api/reviews` - Tạo đánh giá mới
- `PUT /api/reviews/:id` - Cập nhật đánh giá
- `DELETE /api/reviews/:id` - Xóa đánh giá

#### **Orders APIs** 💳
- `POST /api/orders/create-order` - Tạo đơn hàng với PayPal
- `POST /api/orders/capture-order/:orderId` - Xác nhận thanh toán
- `GET /api/orders/:orderId` - Lấy thông tin đơn hàng

---

### 🔑 Authentication

Một số API yêu cầu xác thực JWT token. Để test các API này trên Swagger:

1. **Đăng nhập để lấy token:**
   - Sử dụng endpoint `POST /api/auth/login`
   - Nhập email và password
   - Copy JWT token từ response

2. **Thêm token vào Swagger:**
   - Click nút **"Authorize"** ở góc trên bên phải
   - Nhập: `Bearer YOUR_JWT_TOKEN_HERE`
   - Click **"Authorize"**
   - Tất cả các request sau sẽ tự động include token

### 📝 Test Accounts

Sử dụng các tài khoản sau để test:

**Admin Account:**
```
Email: admin@edushop.com
Password: admin123
```

**Customer Accounts:**
```
Email: customer1@test.com
Password: 123456

Email: customer2@test.com
Password: 123456
```

---

### 🎯 Ví dụ sử dụng API

#### 1. Đăng nhập
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "customer1@test.com",
  "password": "123456"
}
```

#### 2. Lấy danh sách khóa học
```bash
GET http://localhost:5000/api/courses?category=Lập Trình Web&page=1&limit=12&sort=newest
```

#### 3. Tìm kiếm khóa học
```bash
GET http://localhost:5000/api/courses?search=javascript&minPrice=0&maxPrice=200
```

#### 4. Lấy chi tiết khóa học
```bash
GET http://localhost:5000/api/courses/slug/ultimate-investment-banking-course
```

#### 5. Thêm vào giỏ hàng (yêu cầu JWT)
```bash
POST http://localhost:5000/api/carts/add
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "courseId": "507f1f77bcf86cd799439011"
}
```

---

### 🛠️ Query Parameters cho GET /api/courses

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `category` | string | Lọc theo danh mục (phân cách bằng dấu phẩy) | `Lập Trình Web,Thiết Kế` |
| `level` | string | Lọc theo cấp độ | `Beginner` |
| `minPrice` | number | Giá tối thiểu (USD) | `0` |
| `maxPrice` | number | Giá tối đa (USD) | `200` |
| `search` | string | Tìm kiếm theo từ khóa | `javascript` |
| `sort` | string | Sắp xếp: `newest`, `popular`, `rating`, `price-asc`, `price-desc` | `newest` |
| `page` | integer | Số trang | `1` |
| `limit` | integer | Số items mỗi trang | `12` |

---

### 📊 Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Data here
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

**Pagination Response:**
```json
{
  "success": true,
  "data": {
    "courses": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "totalPages": 10,
      "totalCourses": 120
    }
  }
}
```

---

### 🔒 Security

- JWT tokens hết hạn sau **30 ngày**
- Passwords được hash bằng **bcrypt** với salt rounds = 10
- CORS được enable cho development
- Admin routes yêu cầu `role: "admin"` trong JWT payload

---

### 📱 Frontend Integration

**Axios Config (đã tích hợp):**
```typescript
// frontend/src/api/axiosConfig.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Auto attach JWT token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### 🎨 Swagger UI Features

✅ **Interactive Documentation** - Test API trực tiếp trên browser  
✅ **Request/Response Examples** - Xem ví dụ về format  
✅ **Schema Validation** - Kiểm tra tự động input  
✅ **Authentication Support** - Test với JWT token  
✅ **Try it out** - Execute API và xem kết quả real-time  

---

### 💡 Tips

1. **Sorting:** Sử dụng `sort=rating` để lấy khóa học rating cao nhất
2. **Filtering:** Có thể combine nhiều filters: `?category=Web&level=Beginner&maxPrice=100`
3. **Search:** Search tìm trong title, description, instructor và tags
4. **Pagination:** Luôn kiểm tra `totalPages` trong response để pagination

---

### 🐛 Troubleshooting

**Lỗi 401 Unauthorized:**
- Kiểm tra JWT token có hợp lệ không
- Token có expired chưa (30 ngày)
- Đã click "Authorize" trong Swagger UI chưa

**Lỗi 404 Not Found:**
- Kiểm tra endpoint URL
- Kiểm tra ID/slug có tồn tại trong database không

**Lỗi 500 Server Error:**
- Xem server logs để biết chi tiết
- Kiểm tra database connection
- Kiểm tra request body format

---

## 📞 Support

Nếu cần hỗ trợ, vui lòng liên hệ:
- Email: support@edushop.com
- GitHub Issues: [Create Issue](https://github.com/your-repo/issues)

---

**Happy Coding! 🚀**
