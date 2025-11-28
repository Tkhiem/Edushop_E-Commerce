# ⚡ SETUP NHANH FACEBOOK MESSENGER

## 🎯 MỤC TIÊU
Tích hợp Facebook Messenger để đạt **0.5 điểm**

---

## 📋 3 BƯỚC NHANH (10 PHÚT)

### **1. TẠO FACEBOOK PAGE**
→ https://www.facebook.com/pages/creation/
- Tên: **EduShop**
- Loại: **Business or Brand**
- Category: **Education**

### **2. LẤY PAGE ID**
→ Vào Page → Settings → About → Copy **Page ID**

### **3. CẬP NHẬT CODE**
Mở: `frontend/src/components/layout/Layout.tsx`

Tìm:
```tsx
const FB_PAGE_ID = "YOUR_PAGE_ID";
```

Thay:
```tsx
const FB_PAGE_ID = "123456789012345"; // ← Dán Page ID
```

---

## ✅ HOÀN TẤT!

```powershell
cd frontend
npm run dev
```

→ Mở http://localhost:5173  
→ Đợi 10 giây  
→ Thấy Messenger widget ở góc phải! 💬

---

## 📱 ADMIN NHẬN TIN NHẮN

Download app **"Facebook Pages"**:
- iOS: App Store
- Android: Play Store

→ Đăng nhập → Chọn Page → Inbox → Trả lời!

---

## 📄 CHI TIẾT ĐẦY ĐỦ

Xem: **MESSENGER_ZALO_SETUP_GUIDE.md**

---

✅ **ĐẠT 0.5Đ CHO YÊU CẦU "FB MESSENGER/ZALO"!** 🎉
