# 📋 EduShop API Endpoints Summary

## Tổng hợp các API hiện có trong hệ thống

---

## 🔐 Authentication APIs

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới | ❌ | ❌ |
| POST | `/api/auth/login` | Đăng nhập vào hệ thống | ❌ | ❌ |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại | ✅ | ❌ |
| POST | `/api/auth/create-admin` | Tạo tài khoản admin | ❌ | ❌ |

**Request Examples:**
```json
// Register
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyen.van.a@example.com",
  "password": "password123"
}

// Login
{
  "email": "customer1@test.com",
  "password": "123456"
}
```

---

## 📚 Courses APIs

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/courses` | Lấy danh sách khóa học (filter, search, sort, pagination) | ❌ | ❌ |
| GET | `/api/courses/search/suggestions` | Gợi ý tìm kiếm khóa học | ❌ | ❌ |
| GET | `/api/courses/slug/:slug` | Lấy chi tiết khóa học theo slug | ❌ | ❌ |
| GET | `/api/courses/:id` | Lấy chi tiết khóa học theo ID | ❌ | ❌ |
| POST | `/api/courses` | Tạo khóa học mới | ✅ | ✅ |
| PUT | `/api/courses/:id` | Cập nhật khóa học | ✅ | ✅ |
| DELETE | `/api/courses/:id` | Xóa khóa học | ✅ | ✅ |

**Query Parameters (GET /api/courses):**
- `category` - Lọc theo danh mục (string, có thể multiple)
- `level` - Lọc theo cấp độ (Beginner, Intermediate, Advanced)
- `minPrice` - Giá tối thiểu (USD)
- `maxPrice` - Giá tối đa (USD)
- `search` - Tìm kiếm từ khóa
- `sort` - Sắp xếp (newest, popular, rating, price-asc, price-desc)
- `page` - Số trang (default: 1)
- `limit` - Số items/trang (default: 12)

**Example:**
```
GET /api/courses?category=Lập Trình Web&level=Beginner&maxPrice=200&sort=rating&page=1&limit=12
```

---

## 🏷️ Categories APIs

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/categories` | Lấy danh sách tất cả danh mục | ❌ | ❌ |
| GET | `/api/categories/with-counts` | Lấy danh mục kèm số lượng khóa học | ❌ | ❌ |

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Lập Trình Web",
      "slug": "lap-trinh-web",
      "courseCount": 150
    }
  ]
}
```

---

## 🛒 Carts APIs

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/carts` | Lấy giỏ hàng của user hiện tại | ✅ | ❌ |
| POST | `/api/carts/add` | Thêm khóa học vào giỏ hàng | ✅ | ❌ |
| DELETE | `/api/carts/remove/:courseId` | Xóa khóa học khỏi giỏ hàng | ✅ | ❌ |
| PUT | `/api/carts/update` | Cập nhật số lượng | ✅ | ❌ |
| DELETE | `/api/carts/clear` | Xóa toàn bộ giỏ hàng | ✅ | ❌ |

**Request Example (Add to cart):**
```json
{
  "courseId": "507f1f77bcf86cd799439011"
}
```

---

## ❤️ Favorites APIs

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/favorites/:userId` | Lấy danh sách yêu thích của user | ❌ | ❌ |
| POST | `/api/favorites/:userId` | Thêm khóa học vào danh sách yêu thích | ❌ | ❌ |
| DELETE | `/api/favorites/:userId/:courseId` | Xóa khóa học khỏi danh sách yêu thích | ❌ | ❌ |
| DELETE | `/api/favorites/:userId` | Xóa toàn bộ danh sách yêu thích | ❌ | ❌ |

**Request Example:**
```json
{
  "courseId": "507f1f77bcf86cd799439011"
}
```

---

## ⭐ Reviews APIs

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/reviews/course/:courseId` | Lấy đánh giá của một khóa học | ❌ | ❌ |
| GET | `/api/reviews` | Lấy tất cả đánh giá (pagination) | ❌ | ✅ |
| POST | `/api/reviews` | Tạo đánh giá mới | ❌ | ❌ |
| PUT | `/api/reviews/:id` | Cập nhật đánh giá | ❌ | ❌ |
| DELETE | `/api/reviews/:id` | Xóa đánh giá | ❌ | ❌ |

**Request Example (Create review):**
```json
{
  "courseId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Khóa học rất hay và bổ ích!"
}
```

---

## 💳 Orders APIs (PayPal Integration)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| POST | `/api/orders/create-order` | Tạo đơn hàng mới với PayPal | ❌ | ❌ |
| POST | `/api/orders/capture-order/:orderId` | Xác nhận thanh toán đơn hàng | ❌ | ❌ |
| GET | `/api/orders/:orderId` | Lấy thông tin đơn hàng | ❌ | ❌ |

**Request Example (Create order):**
```json
{
  "items": [
    {
      "courseId": "507f1f77bcf86cd799439011",
      "title": "Complete Web Development Bootcamp",
      "price": 99.99
    }
  ]
}
```

---

## 📊 API Statistics

### Tổng số endpoints: **33 APIs**

| Category | Public | Authenticated | Admin Only | Total |
|----------|---------|---------------|-----------|-------|
| Authentication | 2 | 1 | 1 | 4 |
| Courses | 4 | 0 | 3 | 7 |
| Categories | 2 | 0 | 0 | 2 |
| Carts | 0 | 5 | 0 | 5 |
| Favorites | 4 | 0 | 0 | 4 |
| Reviews | 2 | 0 | 3 | 5 |
| Orders | 3 | 0 | 0 | 3 |
| **TOTAL** | **17** | **6** | **7** | **33** |

---

## 🔑 Authentication Flow

```
1. User registers or logs in
   └─> POST /api/auth/register or /api/auth/login
       └─> Receives JWT token

2. Store token in localStorage
   └─> localStorage.setItem('token', token)

3. Include token in subsequent requests
   └─> Authorization: Bearer <token>

4. Server validates token
   └─> middleware/auth.js validates JWT
       ├─> Valid: Continue to route handler
       └─> Invalid: Return 401 Unauthorized
```

---

## 🌐 Base URL

**Development:**
```
http://localhost:5000/api
```

**Production:**
```
https://api.edushop.com/api
```

---

## 📝 Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Pagination Response
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

## 🧪 Testing

### Test Accounts

**Admin:**
```
Email: admin@edushop.com
Password: admin123
```

**Customer 1:**
```
Email: customer1@test.com
Password: 123456
```

**Customer 2:**
```
Email: customer2@test.com
Password: 123456
```

### Using Swagger UI

1. Navigate to: `http://localhost:5000/api-docs`
2. Click "Authorize" button
3. Login to get JWT token
4. Enter: `Bearer <your-token>`
5. Test all endpoints interactively

### Using cURL

```bash
# Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@test.com","password":"123456"}'

# Use token in requests
curl -X GET http://localhost:5000/api/carts \
  -H "Authorization: Bearer <your-token>"
```

### Using Postman

1. Import collection from `/backend/docs/postman_collection.json`
2. Set environment variable `base_url` = `http://localhost:5000/api`
3. Login to get token
4. Set token in Authorization tab (Bearer Token)

---

## 🚀 Quick Start

```bash
# 1. Start backend server
cd backend
npm start

# 2. Access Swagger UI
Open browser: http://localhost:5000/api-docs

# 3. Test APIs
- Click any endpoint
- Click "Try it out"
- Fill in parameters
- Click "Execute"
- View response
```

---

## 📚 Documentation Links

- **Swagger UI:** http://localhost:5000/api-docs
- **API Documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Swagger Annotations:** [swagger-annotations.js](./swagger-annotations.js)

---

**Last Updated:** November 17, 2025  
**Version:** 2.0.0
