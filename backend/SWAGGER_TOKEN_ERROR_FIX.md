# 🔴 LỖI THƯỜNG GẶP: "Bearer Bearer" - Token bị lặp 2 lần

## ❌ Vấn đề bạn đang gặp phải:

Trong curl command có thể thấy:
```bash
-H 'Authorization: Bearer Bearer eyJhbGciOi...'
                    ^^^^^^ ^^^^^^
                    Lỗi: "Bearer" bị lặp 2 lần!
```

Kết quả: **401 Unauthorized - Invalid token**

---

## ✅ Giải pháp

### Bước 1: Logout khỏi Swagger UI
1. Mở Swagger UI: http://localhost:5000/api-docs
2. Click nút 🔒 (locked) ở góc trên
3. Click **"Logout"**

### Bước 2: Lấy token mới
```bash
cd backend
node scripts/getAdminToken.js
```

Copy token (bắt đầu từ `eyJ...`):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTEyYWE0ZjU1ZGRkZDQ1ZWMzMmYyNjIi...
```

### Bước 3: Authorize lại ĐÚNG CÁCH

1. Click nút 🔓 **"Authorize"**

2. Trong dialog "Available authorizations":
   ```
   bearerAuth (http, Bearer)
   Value: [________________]  <-- Paste token VÀO ĐÂY
   ```

3. ⚠️ **QUAN TRỌNG**: Chỉ paste TOKEN, KHÔNG thêm "Bearer"
   
   ❌ **SAI**:
   ```
   Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   
   ✅ **ĐÚNG**:
   ```
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Click **"Authorize"** → **"Close"**

5. Icon sẽ đổi từ 🔓 (unlocked) sang 🔒 (locked)

---

## 🧪 Test lại API

1. Mở endpoint **POST /api/courses**
2. Click **"Try it out"**
3. Nhập request body:
   ```json
   {
     "title": "Lập trình React từ cơ bản đến nâng cao",
     "slug": "lap-trinh-react-abc123",
     "description": "Khóa học React toàn diện",
     "thumbnail": "https://example.com/react.jpg",
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
     "tags": ["react", "javascript"]
   }
   ```
4. Click **"Execute"**

### ✅ Kết quả mong đợi:

```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "_id": "673c...",
    "title": "Lập trình React từ cơ bản đến nâng cao",
    ...
  }
}
```

### Curl command ĐÚNG sẽ có dạng:

```bash
curl -X 'POST' \
  'http://localhost:5000/api/courses' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                    ^^^^^^ (CHỈ 1 lần "Bearer")
```

---

## 🔍 Debugging

Nếu vẫn gặp lỗi, kiểm tra:

### 1. Token có đúng format không?
Token hợp lệ có 3 phần phân cách bởi dấu chấm:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTEyYWE0Zj...xyz.AiikaXbCwIvYxL-yeJUfELRIXOpobW47bNwm7ExLmo8
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        Header (base64)                  Payload (base64)            Signature (base64)
```

### 2. Kiểm tra curl command trong Swagger UI
Sau khi Execute, scroll xuống xem curl command:
- ✅ **ĐÚNG**: `-H 'Authorization: Bearer eyJh...'`
- ❌ **SAI**: `-H 'Authorization: Bearer Bearer eyJh...'`

### 3. Token có hết hạn không?
Token có hiệu lực 7 ngày. Nếu hết hạn:
```bash
node scripts/getAdminToken.js
```

### 4. Backend có chạy không?
```bash
# Terminal 1
cd backend
npm run dev

# Server phải chạy ở port 5000
```

---

## 📚 Tóm tắt

| Trường hợp | Cách nhập token |
|------------|-----------------|
| **Swagger UI** | `eyJhbGciOiJIU...` (KHÔNG có "Bearer") |
| **Postman/Thunder Client** | `Bearer eyJhbGciOiJIU...` (CÓ "Bearer") |
| **Curl command thủ công** | `Bearer eyJhbGciOiJIU...` (CÓ "Bearer") |
| **Frontend (axios)** | Tự động thêm qua interceptor |

**Lý do**: Swagger UI sử dụng `scheme: bearer` nên tự động thêm "Bearer " vào header!
