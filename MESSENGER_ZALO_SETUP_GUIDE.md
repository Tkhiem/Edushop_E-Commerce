# 📱 Hướng Dẫn Tích Hợp Facebook Messenger & Zalo OA

## 🎯 YÊU CẦU
> FB Messenger/Zalo (tạo FanPage, cài bot chat…): 0.5 đ

---

## ✅ OPTION 1: FACEBOOK MESSENGER (Khuyến nghị - Dễ nhất)

### 📋 CÁC BƯỚC SETUP (10 PHÚT)

#### **BƯỚC 1: TẠO FACEBOOK PAGE**

1. **Truy cập:** https://www.facebook.com/pages/creation/
2. Click **"Create New Page"**
3. Chọn loại: **"Business or Brand"**
4. Điền thông tin:
   ```
   Page name: EduShop - Học trực tuyến
   Category: Education / E-learning
   Description: Nền tảng học trực tuyến chất lượng cao
   ```
5. Click **"Create Page"**
6. **Bỏ qua** các bước tùy chỉnh (có thể làm sau)

---

#### **BƯỚC 2: LẤY PAGE ID**

**Cách 1: Từ Settings**
1. Vào Page vừa tạo
2. Click **"Settings"** (⚙️)
3. Click **"Page Info"** hoặc **"About"**
4. Tìm **"Page ID"**
5. **Copy số ID** (dạng: `123456789012345`)

**Cách 2: Từ URL**
1. Vào Page của bạn
2. Nhìn URL:
   ```
   facebook.com/profile.php?id=123456789012345
                              ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                              ĐÂY LÀ PAGE ID
   ```

---

#### **BƯỚC 3: CẬP NHẬT CODE**

Mở file: `frontend/src/components/layout/Layout.tsx`

Tìm dòng:
```tsx
const FB_PAGE_ID = "YOUR_PAGE_ID";
```

Thay bằng Page ID của bạn:
```tsx
const FB_PAGE_ID = "123456789012345"; // ← Dán Page ID vào đây
```

**Save file** (Ctrl+S)

---

#### **BƯỚC 4: TEST**

1. **Restart frontend:**
```powershell
cd frontend
npm run dev
```

2. **Mở browser:** http://localhost:5173 (hoặc 5174)

3. **Đợi 5-10 giây** để Messenger widget load

4. **Tìm ở góc phải dưới:**
   - Widget tròn của Crisp (trắng/xanh)
   - Widget Messenger (xanh Facebook)

5. **Click Messenger widget** → Mở chat

6. **Gửi tin nhắn test**

---

#### **BƯỚC 5: ADMIN NHẬN TIN NHẮN**

**Cách 1: Trên Desktop**
1. Vào Facebook Page của bạn
2. Click **"Inbox"** hoặc **"Messages"**
3. Thấy tin nhắn từ user
4. Trả lời trực tiếp

**Cách 2: Trên Mobile**
1. Download **"Facebook Pages"** app:
   - iOS: App Store → "Facebook Pages"
   - Android: Play Store → "Facebook Pages"
2. Đăng nhập
3. Chọn Page của bạn
4. Vào **"Inbox"**
5. Nhận notification khi có tin nhắn mới
6. Trả lời từ app

---

### 🎨 TÙY CHỈNH MESSENGER

Mở file: `frontend/src/components/chat/MessengerChat.tsx`

```tsx
<div
  className="fb-customerchat"
  data-page-id={pageId}
  data-theme-color="#0084ff" // ← Đổi màu widget
  data-logged-in-greeting="Xin chào! 👋" // ← Tin nhắn chào
  data-logged-out-greeting="Chào bạn!" 
  data-greeting-dialog-display="show" // Hiện popup chào
  data-greeting-dialog-delay="5" // Delay 5 giây
/>
```

---

### 💡 ĐIỀU CHỈNH VỊ TRÍ WIDGET

Nếu 2 widget (Crisp + Messenger) đè lên nhau, tạo file CSS:

`frontend/src/styles/chat-widgets.css`:
```css
/* Điều chỉnh vị trí Messenger */
.fb-customerchat iframe {
  bottom: 100px !important; /* Đẩy lên cao hơn */
  right: 24px !important;
}

/* Hoặc di chuyển sang trái */
.fb-customerchat iframe {
  right: 100px !important; /* Sang trái 100px */
}
```

Import vào `main.tsx`:
```tsx
import './styles/chat-widgets.css';
```

---

## ⚙️ OPTION 2: ZALO OFFICIAL ACCOUNT (Phức tạp hơn)

### ⚠️ LƯU Ý:
- Cần **đăng ký OA** (Official Account)
- Cần **chờ duyệt** 1-3 ngày
- Cần **giấy tờ doanh nghiệp** (cho Business OA)

### 📋 CÁC BƯỚC SETUP

#### **BƯỚC 1: ĐĂNG KÝ ZALO OA**

1. **Truy cập:** https://oa.zalo.me/
2. Đăng nhập bằng **Zalo**
3. Click **"Tạo Official Account"**
4. Chọn loại:
   - **Personal OA:** Cho cá nhân (không cần giấy tờ)
   - **Business OA:** Cho doanh nghiệp (cần ĐKKD)

5. Điền thông tin:
   ```
   Tên OA: EduShop Support
   Danh mục: Giáo dục / E-learning
   Mô tả: Hỗ trợ học trực tuyến
   ```

6. Upload ảnh đại diện

7. Click **"Đăng ký"**

8. **Chờ duyệt:** 1-3 ngày làm việc

---

#### **BƯỚC 2: LẤY OA ID (Sau khi được duyệt)**

1. Vào https://oa.zalo.me/
2. Chọn OA của bạn
3. Vào **"Settings"** → **"Thông tin OA"**
4. Copy **"OA ID"** (dạng số dài)

---

#### **BƯỚC 3: CẬP NHẬT CODE**

Mở: `frontend/src/components/layout/Layout.tsx`

Thêm import:
```tsx
import ZaloChat from "../chat/ZaloChat";
```

Thêm vào return:
```tsx
{/* Zalo OA - Chat qua Zalo */}
<ZaloChat oaId="YOUR_ZALO_OA_ID" />
```

---

#### **BƯỚC 4: ADMIN NHẬN TIN NHẮN**

1. Download **"Zalo OA"** app:
   - iOS: App Store → "Zalo OA"
   - Android: Play Store → "Zalo OA"

2. Đăng nhập bằng Zalo

3. Chọn OA của bạn

4. Vào **"Tin nhắn"** để nhận và trả lời

---

## 🎯 SO SÁNH 2 GIẢI PHÁP

| Tiêu chí | Facebook Messenger | Zalo OA |
|----------|-------------------|---------|
| **Setup** | ⭐⭐⭐⭐⭐ Rất dễ | ⭐⭐⭐ Trung bình |
| **Thời gian** | 10 phút | 20 phút + chờ duyệt |
| **Giấy tờ** | ❌ Không cần | ✅ Cần (Business) |
| **Phổ biến VN** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Localhost** | ✅ Hoạt động | ✅ Hoạt động |
| **Miễn phí** | ✅ | ✅ (Basic) |

**→ KHUYẾN NGHỊ: Dùng Facebook Messenger (dễ hơn, không chờ duyệt)**

---

## ✅ CHECKLIST SAU KHI SETUP

### Facebook Messenger:
- [ ] Tạo Facebook Page
- [ ] Lấy Page ID
- [ ] Thay vào code
- [ ] Restart frontend
- [ ] Thấy Messenger widget
- [ ] Gửi tin nhắn test
- [ ] Admin nhận được trên Page Inbox
- [ ] Admin trả lời được
- [ ] User nhận reply

### Zalo OA:
- [ ] Đăng ký Zalo OA
- [ ] Chờ duyệt (1-3 ngày)
- [ ] Lấy OA ID
- [ ] Thay vào code
- [ ] Restart frontend
- [ ] Thấy Zalo widget
- [ ] Gửi tin nhắn test
- [ ] Admin nhận trên Zalo OA app
- [ ] Admin trả lời được
- [ ] User nhận reply

---

## 🏆 ĐIỂM ĐẠT ĐƯỢC

| Yêu cầu | Điểm |
|---------|------|
| ✅ Live chat support | 1.0đ |
| ✅ Plugin chat (Crisp) | 0.5đ |
| ✅ **FB Messenger/Zalo** | **0.5đ** ⭐ |
| **TỔNG CỘNG** | **2.0đ** 🎉 |

---

## ❓ FAQ

### Q: Có cần host website không?
**A:** KHÔNG! Hoạt động 100% trên localhost.

### Q: Facebook Messenger vs Zalo, chọn cái nào?
**A:** 
- **Messenger:** Dễ setup, không chờ duyệt → Khuyến nghị
- **Zalo:** Phổ biến hơn VN nhưng phải chờ duyệt

### Q: Có thể dùng cả 2 không?
**A:** CÓ! Nhưng cần điều chỉnh vị trí widget tránh đè lên nhau.

### Q: Widget hiển thị ở đâu?
**A:** Góc phải dưới màn hình (giống Crisp)

### Q: Có giới hạn tin nhắn không?
**A:** KHÔNG! Cả 2 đều miễn phí unlimited.

---

## 🆘 TROUBLESHOOTING

### Messenger widget không hiện:
1. Check Page ID đã đúng chưa
2. Page có public chưa (không phải Draft)
3. Đợi 10-15 giây để widget load
4. Hard refresh: Ctrl+Shift+R
5. Test trên Incognito mode

### Zalo widget không hiện:
1. Check OA ID đã đúng chưa
2. OA đã được duyệt chưa (status: Active)
3. Zalo SDK load thành công chưa (F12 → Console)
4. Clear cache và restart

---

## 🎉 KẾT LUẬN

✅ **Messenger dễ nhất** - Setup 10 phút, không chờ duyệt  
✅ **Zalo phổ biến nhất VN** - Nhưng phải đăng ký OA  
✅ **Cả 2 đều đạt 0.5đ** cho yêu cầu "FB Messenger/Zalo"  
✅ **Không cần host** - Hoạt động trên localhost  

**Chúc bạn setup thành công! 🚀**
