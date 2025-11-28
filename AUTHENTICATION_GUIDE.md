# 🔐 Hướng dẫn Authentication & Giỏ hàng

## ✅ Tính năng đã hoàn thành

### 1. **Authentication (Xác thực)**
- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập với email/password
- ✅ JWT token authentication
- ✅ AuthContext quản lý trạng thái đăng nhập toàn cục
- ✅ Auto-load user từ localStorage khi reload trang
- ✅ Phân quyền Admin/Customer

### 2. **Giỏ hàng theo tài khoản**
- ✅ Mỗi user có giỏ hàng riêng (lưu trên database)
- ✅ Yêu cầu đăng nhập khi thêm vào giỏ hàng
- ✅ Tự động load giỏ hàng khi login
- ✅ Đồng bộ giỏ hàng giữa các thiết bị

### 3. **Redirect sau login**
- ✅ Customer → Trang chủ (/)
- ✅ Admin → Dashboard Admin (/admin)
- ✅ Header hiển thị thông tin user đã đăng nhập

---

## 🚀 Hướng dẫn Test

### **Bước 1: Khởi động Backend & Frontend**

**Terminal 1 - Backend:**
```powershell
cd backend
node server.js
```
→ Backend chạy tại: `http://localhost:5000`

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```
→ Frontend chạy tại: `http://localhost:5173`

---

### **Bước 2: Test Đăng nhập**

#### **Test với Customer:**
1. Truy cập: `http://localhost:5173/login`
2. Nhập thông tin:
   - Email: `customer1@test.com`
   - Password: `123456`
3. Click "Đăng nhập"
4. ✅ Kiểm tra:
   - Redirect về trang chủ `/`
   - Header hiển thị avatar user
   - Click avatar → Xem dropdown menu

#### **Test với Admin:**
1. Truy cập: `http://localhost:5173/login`
2. Nhập thông tin:
   - Email: `admin@edushop.com`
   - Password: `admin123`
3. Click "Đăng nhập"
4. ✅ Kiểm tra:
   - Redirect về `/admin` (Dashboard admin)
   - Hiển thị thống kê và quản lý
   - Header có menu "Admin Dashboard"

---

### **Bước 3: Test Giỏ hàng theo tài khoản**

#### **Scenario 1: Chưa đăng nhập**
1. Vào trang chủ (chưa login)
2. Click "Thêm vào giỏ hàng" ở bất kỳ khóa học nào
3. ✅ Kiểm tra: Hiển thị alert "Vui lòng đăng nhập để thêm vào giỏ hàng"

#### **Scenario 2: Đã đăng nhập - Account 1**
1. Đăng nhập với `customer1@test.com`
2. Thêm 2-3 khóa học vào giỏ hàng
3. Truy cập `/cart` → Xem giỏ hàng
4. ✅ Kiểm tra: Hiển thị đúng các khóa học vừa thêm

#### **Scenario 3: Đổi tài khoản - Account 2**
1. Đăng xuất (Click avatar → "Đăng xuất")
2. Đăng nhập với `customer2@test.com` / `123456`
3. Truy cập `/cart`
4. ✅ Kiểm tra: Giỏ hàng TRỐNG (khác với account 1)
5. Thêm khóa học khác vào giỏ
6. ✅ Kiểm tra: Chỉ hiển thị khóa học của account 2

#### **Scenario 4: Đăng nhập lại Account 1**
1. Đăng xuất
2. Đăng nhập lại với `customer1@test.com`
3. Truy cập `/cart`
4. ✅ Kiểm tra: Giỏ hàng vẫn còn các khóa học đã thêm trước đó

---

### **Bước 4: Test Đăng ký tài khoản mới**

1. Truy cập: `http://localhost:5173/register`
2. Nhập thông tin:
   - Họ tên: `Nguyễn Văn C`
   - Email: `newuser@test.com`
   - Password: `123456`
   - Xác nhận mật khẩu: `123456`
3. Click "Đăng ký"
4. ✅ Kiểm tra:
   - Tự động đăng nhập
   - Redirect về trang chủ
   - Header hiển thị tên user mới
   - Giỏ hàng trống

---

### **Bước 5: Test Navigation & Header**

#### **Dropdown Menu (Đã đăng nhập):**
1. Click vào avatar ở góc phải header
2. ✅ Kiểm tra hiển thị:
   - Họ tên user
   - Email
   - Role (Admin/Customer)
   - Menu: "Hồ sơ cá nhân"
   - Menu: "Admin Dashboard" (chỉ admin)
   - Menu: "Yêu thích"
   - Menu: "Giỏ hàng"
   - Menu: "Đăng xuất"

#### **Click Logo:**
1. Click vào logo "EduShop" ở góc trái
2. ✅ Kiểm tra: Redirect về trang chủ `/`
3. ✅ Kiểm tra: Trang chủ vẫn hiển thị thông tin user đã login

#### **Đăng xuất:**
1. Click avatar → "Đăng xuất"
2. ✅ Kiểm tra:
   - Redirect về trang chủ
   - Header hiển thị nút "Đăng nhập/Đăng ký"
   - Click "Thêm vào giỏ" → Yêu cầu đăng nhập

---

## 📊 Kiểm tra Database

### **Xem tài khoản hiện có:**
```powershell
cd backend
node scripts/checkUsers.js
```

### **Tạo tài khoản test:**
```powershell
node scripts/createTestUsers.js
```

---

## 🎯 Tài khoản Test có sẵn

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| 🔑 **Admin** | admin@edushop.com | admin123 |
| 👤 **Customer 1** | customer1@test.com | 123456 |
| 👤 **Customer 2** | customer2@test.com | 123456 |

---

## 🔧 Technical Details

### **Backend API Endpoints:**
```
POST /api/auth/register          - Đăng ký
POST /api/auth/login             - Đăng nhập
GET  /api/auth/me                - Lấy thông tin user hiện tại

GET    /api/carts                - Lấy giỏ hàng (require auth)
POST   /api/carts/add            - Thêm vào giỏ (require auth)
DELETE /api/carts/remove/:id     - Xóa khỏi giỏ (require auth)
DELETE /api/carts/clear          - Xóa toàn bộ giỏ (require auth)
```

### **Frontend Routes:**
```
/                    - Trang chủ
/login               - Đăng nhập
/register            - Đăng ký
/profile             - Hồ sơ cá nhân (require auth)
/admin               - Dashboard admin (require admin role)
/cart                - Giỏ hàng (require auth)
/favorites           - Yêu thích
/course/:slug        - Chi tiết khóa học
```

### **State Management:**
- **AuthContext**: Quản lý user, token, login/logout
- **CartProvider**: Quản lý giỏ hàng (sync với database)
- **FavoritesProvider**: Quản lý yêu thích (localStorage)

---

## ✅ Checklist Test

- [ ] Đăng nhập customer → Redirect về `/`
- [ ] Đăng nhập admin → Redirect về `/admin`
- [ ] Header hiển thị thông tin user đúng
- [ ] Dropdown menu đầy đủ chức năng
- [ ] Chưa login + thêm giỏ → Alert yêu cầu đăng nhập
- [ ] Giỏ hàng riêng theo từng tài khoản
- [ ] Đăng xuất → Xóa token, về trang chủ
- [ ] Reload trang → User vẫn đăng nhập (auto-load từ localStorage)
- [ ] Click logo → Về trang chủ (vẫn giữ trạng thái login)
- [ ] Đăng ký mới → Tự động login và redirect

---

## 🎉 Kết quả mong đợi

✅ User login → Trang chủ bình thường nhưng header hiển thị user  
✅ Click logo → Về trang chủ, không phải profile  
✅ Giỏ hàng riêng cho từng user (lưu database)  
✅ Chưa login → Không thêm được vào giỏ  
✅ Admin → Truy cập dashboard riêng  
✅ Trải nghiệm mượt mà, không lỗi  
