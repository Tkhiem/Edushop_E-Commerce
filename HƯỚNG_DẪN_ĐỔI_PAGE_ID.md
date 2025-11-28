# 📝 HƯỚNG DẪN THAY ĐỔI FACEBOOK PAGE ID

## 🎯 MỤC ĐÍCH
Thay đổi Facebook Page ID để widget Messenger hiển thị đúng Page của bạn.

---

## 📍 BƯỚC 1: LẤY PAGE ID CỦA BẠN

### Cách 1: Từ Facebook Page Settings
1. Vào Facebook Page của bạn
2. Click **Settings** (⚙️ Cài đặt) ở góc trái
3. Click **Page info** (Thông tin trang)
4. Tìm **Page ID** và copy số đó
   - Ví dụ: `123456789012345`

### Cách 2: Từ URL Page
1. Vào Facebook Page của bạn
2. Nhìn vào URL trên thanh địa chỉ:
   - Nếu URL dạng: `facebook.com/YourPageName` → Dùng cách 1
   - Nếu URL dạng: `facebook.com/profile.php?id=123456789012345` → Số sau `id=` là Page ID

### Cách 3: Dùng Tool Online
1. Truy cập: https://findmyfbid.com/
2. Paste link Facebook Page của bạn
3. Click "Find Page ID"
4. Copy Page ID

---

## 🔧 BƯỚC 2: THAY ĐỔI PAGE ID TRONG CODE

### File cần sửa: `frontend/src/components/layout/Layout.tsx`

**Dòng cần sửa: Dòng 26**

```typescript
// ⚠️ THAY ĐỔI PAGE ID CỦA BẠN Ở ĐÂY ⚠️
const FB_PAGE_ID = "949394608251189"; // 👈 Thay số này bằng Page ID của bạn
```

**Ví dụ:**
```typescript
// Page ID cũ
const FB_PAGE_ID = "949394608251189";

// ↓ Thay bằng Page ID mới của bạn ↓
const FB_PAGE_ID = "123456789012345"; // Page ID mới
```

### Lưu file (Ctrl + S)

---

## ✅ BƯỚC 3: KIỂM TRA PAGE SETTINGS

Trước khi widget hoạt động, đảm bảo:

### 1. Page đã PUBLISHED (Công khai)
- Vào **Page Settings** → **General**
- Tìm **Page visibility**
- Chọn **"Page published"** (Trang đã xuất bản)
- ❌ KHÔNG để **"Page unpublished"** (Chưa xuất bản)

### 2. Bật Messenger Settings
- Vào **Page Settings** → **Messaging**
- Bật các tùy chọn:
  - ✅ **"Allow people to contact my Page privately by showing the Message button"**
  - ✅ **"Show a Messenger greeting"**
  - ✅ **"Allow people and other Pages to send messages to your Page"**

### 3. Response Assistant (Tùy chọn)
- Trong **Messaging**, bật **"Response Assistant"**
- Thiết lập **Instant Reply** (Trả lời tự động)
- Giúp tự động trả lời khi bạn không online

---

## 🚀 BƯỚC 4: CHẠY LẠI WEBSITE

```powershell
# Dừng server hiện tại (Ctrl + C)

# Chạy lại
cd frontend
npm run dev
```

Mở browser: `http://localhost:5173`

---

## 👀 BƯỚC 5: KIỂM TRA WIDGET

### Sau 5-10 giây, bạn sẽ thấy:
- **Biểu tượng Messenger** (hình bong bóng xanh) ở góc dưới bên phải
- Click vào để mở chat
- Gửi tin nhắn thử

### Kiểm tra Console Log:
1. Mở Developer Tools (F12)
2. Vào tab **Console**
3. Xem log:
```
[Messenger] 🚀 Initializing with Page ID: 123456789012345
[Messenger] 📌 Check: https://www.facebook.com/123456789012345
[Messenger] ✅ FB SDK initialized
[Messenger] 🔍 Chat element: ✅ Found
[Messenger] ✅ SUCCESS! Widget rendered!
```

---

## 🐛 KHẮC PHỤC SỰ CỐ

### ❌ Widget không hiển thị?

#### 1. Kiểm tra Page ID
```
Console log: [Messenger] 📌 Check: https://www.facebook.com/YOUR_PAGE_ID
```
- Click vào link trên
- Nếu **không mở được Page** → Page ID SAI
- Nếu **mở được Page** → Page ID ĐÚNG

#### 2. Kiểm tra Page đã Public chưa
- Vào Page Settings → Page Visibility
- Phải là **"Published"**

#### 3. Kiểm tra Messenger Settings
- Page Settings → Messaging
- Tất cả phải **ON** (bật)

#### 4. Thử Hard Refresh
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

#### 5. Xóa Cache Browser
- Mở Developer Tools (F12)
- Right click vào nút Refresh
- Chọn **"Empty Cache and Hard Reload"**

#### 6. Kiểm tra Network
- Mở Developer Tools → Tab **Network**
- Tìm request đến `facebook.net`
- Nếu **failed** → Facebook bị chặn (VPN/Firewall)

---

## 📱 NHẬN TIN NHẮN TỪ KHÁCH

### 1. Trên Desktop:
- Vào: https://www.facebook.com/messages
- Hoặc: Vào Page → Inbox

### 2. Trên Mobile:
- Cài **Facebook Pages Manager** app
- Đăng nhập
- Chọn Page của bạn
- Vào **Inbox** → Nhận tin nhắn real-time

---

## 📊 TỔNG KẾT

| Bước | File | Dòng | Nội dung |
|------|------|------|----------|
| 1 | - | - | Lấy Page ID từ Facebook |
| 2 | `Layout.tsx` | 26 | Thay `FB_PAGE_ID` |
| 3 | Facebook | - | Kiểm tra Page Settings |
| 4 | Terminal | - | `npm run dev` |
| 5 | Browser | - | Test widget |

---

## 💡 LƯU Ý QUAN TRỌNG

1. **Page ID phải là số** (12-15 chữ số)
   - ✅ Đúng: `"123456789012345"`
   - ❌ Sai: `"MyPageName"` (username không dùng được)

2. **Page phải Public**
   - Widget chỉ hoạt động với Page đã publish

3. **Messenger Settings phải bật**
   - Không bật = widget không hiện

4. **Widget cần 5-10 giây để load**
   - Đừng lo nếu không thấy ngay lập tức

5. **Facebook có thể chặn localhost**
   - Nếu không hoạt động local, thử deploy lên Vercel/Netlify

---

## 🎯 KẾT QUẢ MONG MUỐN

Sau khi hoàn thành:
- ✅ Widget Messenger hiển thị ở góc phải dưới
- ✅ Click vào mở chat với Page của bạn
- ✅ Gửi tin nhắn → Nhận được trong Page Inbox
- ✅ Admin trả lời trên Facebook → User thấy trên website

---

## 🆘 CẦN GIÚP ĐỠ?

Nếu vẫn không hoạt động:
1. Copy toàn bộ Console log (F12 → Console tab)
2. Chụp screenshot widget (nếu có hiển thị gì)
3. Check Page Settings screenshot
4. Gửi cho developer để debug

---

**Chúc bạn setup thành công! 🎉**
