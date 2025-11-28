# 🚀 Hướng dẫn Setup Tawk.to Chi Tiết

## ⚡ TẠI SAO DÙNG TAWK.TO?

### ✅ Ưu điểm:
1. **MIỄN PHÍ 100%** - Không giới hạn số lượng chat
2. **Mobile App** - Admin nhận thông báo ngay lập tức
3. **Lưu lịch sử** - Tất cả chat được lưu vĩnh viễn
4. **Nhiều agent** - Nhiều người cùng trả lời
5. **Analytics** - Báo cáo chi tiết về khách hàng

### ❌ So với Custom Chat:
| Tính năng | Custom Chat | Tawk.to |
|-----------|-------------|---------|
| Admin nhận tin nhắn | ❌ KHÔNG | ✅ CÓ |
| Mobile app | ❌ KHÔNG | ✅ CÓ |
| Lưu lịch sử | ❌ KHÔNG | ✅ CÓ |
| Thông báo real-time | ❌ KHÔNG | ✅ CÓ |

---

## 📱 BƯỚC 1: Đăng ký Tawk.to (5 phút)

### 1.1. Truy cập website
```
https://www.tawk.to/
```

### 1.2. Click "Sign Up Free"
- Email: admin@edushop.com (hoặc email của bạn)
- Password: Tạo mật khẩu mạnh
- Click "Sign Up"

### 1.3. Xác nhận email
- Check email inbox
- Click link xác nhận
- Đăng nhập vào dashboard

---

## 🏢 BƯỚC 2: Tạo Property (3 phút)

### 2.1. Tạo Property mới
```
Dashboard → Add Property
```

### 2.2. Điền thông tin
- **Property Name:** EduShop
- **Website URL:** http://localhost:5173
  (Sau khi deploy, thay bằng domain thật: https://edushop.vn)
- Click "Add Property"

### 2.3. Lấy Widget Code
```
Dashboard → Administration → Channels → Chat Widget
```

Bạn sẽ thấy đoạn code như này:
```html
<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/67abc123def/1hfg456xyz';
              ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑   ↑↑↑↑↑↑↑↑↑↑↑
              PROPERTY_ID         WIDGET_ID
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->
```

**QUAN TRỌNG:** Copy 2 mã này:
- `PROPERTY_ID`: Phần sau `embed.tawk.to/` (ví dụ: `67abc123def`)
- `WIDGET_ID`: Phần tiếp theo (ví dụ: `1hfg456xyz`)

---

## 💻 BƯỚC 3: Cấu hình Code (2 phút)

### 3.1. Mở file cấu hình
```
frontend/src/components/chat/LiveChatWidget.tsx
```

### 3.2. Thay đổi 2 dòng này
```tsx
// TÌM:
const TAWK_PROPERTY_ID = "YOUR_PROPERTY_ID";
const TAWK_WIDGET_ID = "YOUR_WIDGET_ID";

// THAY BẰNG (dán mã của bạn):
const TAWK_PROPERTY_ID = "67abc123def"; // ← Dán Property ID vào đây
const TAWK_WIDGET_ID = "1hfg456xyz";    // ← Dán Widget ID vào đây
```

### 3.3. Thay đổi trong Layout
Mở: `frontend/src/components/layout/Layout.tsx`

```tsx
// TÌM dòng này:
import CustomLiveChat from "../chat/CustomLiveChat";

// THAY BẰNG:
import LiveChatWidget from "../chat/LiveChatWidget";

// Và trong return, TÌM:
<CustomLiveChat />

// THAY BẰNG:
<LiveChatWidget />
```

---

## 🎨 BƯỚC 4: Tùy chỉnh giao diện (Optional)

### 4.1. Vào Dashboard
```
Dashboard → Administration → Chat Widget → Appearance
```

### 4.2. Tùy chỉnh:
- **Widget Name:** EduShop Support
- **Color:** #14b24c (màu xanh lá của EduShop)
- **Position:** Bottom right
- **Bubble Icon:** 💬 Chat với chúng tôi
- **Greeting Message:** 
  ```
  Xin chào! 👋
  Chúng tôi có thể giúp gì cho bạn?
  ```

### 4.3. Save changes

---

## 📱 BƯỚC 5: Cài Mobile App (Quan trọng!)

### 5.1. Download app
**iOS (iPhone):**
```
App Store → Tìm "Tawk.to"
https://apps.apple.com/app/tawk-to/id632015345
```

**Android:**
```
Play Store → Tìm "Tawk.to"
https://play.google.com/store/apps/details?id=to.tawk.tawkto
```

### 5.2. Đăng nhập
- Mở app
- Đăng nhập bằng email/password đã tạo
- Cho phép Notifications (QUAN TRỌNG!)

### 5.3. Test nhận thông báo
- Mở website trên máy tính
- Gửi 1 tin nhắn test
- Kiểm tra phone → App sẽ có notification ngay lập tức! 🔔

---

## ✅ BƯỚC 6: Test hoạt động

### 6.1. Restart frontend
```powershell
cd frontend
npm run dev
```

### 6.2. Mở website
```
http://localhost:5173
```

### 6.3. Test chat
1. Click nút chat ở góc phải dưới
2. Gửi tin nhắn: "Xin chào, tôi cần tư vấn khóa học"
3. Check mobile app → Thông báo xuất hiện! ✅
4. Trả lời tin nhắn từ app
5. Website nhận được tin nhắn ngay lập tức! ✅

---

## 🎯 CÁCH ADMIN NHẬN TIN NHẮN

### Option 1: Mobile App (Khuyến nghị)
```
📱 Phone rung
↓
Mở Tawk.to app
↓
Xem tin nhắn
↓
Trả lời ngay
↓
User nhận được trên website
```

### Option 2: Web Dashboard
```
💻 Mở https://dashboard.tawk.to/
↓
Đăng nhập
↓
Click "Conversations" → "Active"
↓
Xem danh sách chat đang chờ
↓
Click vào user → Trả lời
```

### Option 3: Email Notification
```
Dashboard → Settings → Email Notifications
↓
Bật "New messages"
↓
Admin nhận email khi có tin nhắn mới
```

---

## 📊 DASHBOARD ADMIN

### Xem thống kê:
```
Dashboard → Analytics
```

Bạn sẽ thấy:
- **Total Chats:** Tổng số chat
- **Active Chats:** Đang chat
- **Resolved:** Đã giải quyết
- **Response Time:** Thời gian phản hồi trung bình
- **Visitor Path:** User đang ở trang nào trên website

### Xem lịch sử chat:
```
Dashboard → Conversations → History
```

Tất cả chat được lưu vĩnh viễn, có thể search theo:
- Tên user
- Email
- Ngày giờ
- Nội dung tin nhắn

---

## 👥 THÊM AGENT (Nhân viên hỗ trợ)

### Nếu có nhiều người trả lời chat:

```
Dashboard → Administration → Team → Invite Agent
```

- Nhập email nhân viên
- Chọn quyền: Admin hoặc Agent
- Gửi lời mời
- Nhân viên nhận email → Accept → Cài app → Bắt đầu trả lời

**LƯU Ý:** Tawk.to miễn phí cho **UNLIMITED AGENTS**!

---

## 🔔 NOTIFICATION SETTINGS

### Đảm bảo nhận thông báo:

**Trên Mobile App:**
```
Settings → Notifications
↓
✅ Push Notifications: ON
✅ Sound: ON
✅ Vibration: ON
✅ New messages: ON
```

**Trên Web:**
```
Dashboard → Settings → Notifications
↓
✅ Desktop notifications: ON
✅ Sound: ON
✅ Email notifications: ON
```

---

## 🌟 TIPS & TRICKS

### 1. Auto-reply khi offline
```
Dashboard → Administration → Chat Widget → Offline Mode
↓
Bật "Show offline form"
↓
Tin nhắn: "Chúng tôi đang offline. Vui lòng để lại tin nhắn!"
```

### 2. Canned Responses (Tin nhắn mẫu)
```
Dashboard → Administration → Canned Responses → Add
```

Tạo các câu trả lời nhanh:
- "Cảm ơn bạn đã liên hệ..."
- "Khóa học này có giá..."
- "Thời gian học là..."

### 3. Visitor Information
Dashboard tự động thu thập:
- IP address
- Location (Thành phố, Quốc gia)
- Device (Mobile, Desktop)
- Browser (Chrome, Safari...)
- Pages visited (Trang nào user đang xem)

### 4. Triggers (Tự động gửi tin nhắn)
```
Dashboard → Administration → Triggers → Add
```

Ví dụ:
- Khi user ở trang > 30s → "Cần giúp đỡ không?"
- Khi user add to cart → "Bạn cần tư vấn về khóa học này?"

---

## ❓ FAQ

### Q: Tawk.to có mất phí không?
**A:** KHÔNG! 100% miễn phí vĩnh viễn.

### Q: Có giới hạn số lượng chat không?
**A:** KHÔNG! Unlimited chats, unlimited agents.

### Q: Admin không online thì sao?
**A:** User có thể để lại tin nhắn, bạn sẽ nhận email và trả lời sau.

### Q: Có thể xóa Custom Chat không?
**A:** CÓ! Sau khi setup Tawk.to, Custom Chat không cần nữa.

### Q: Tawk.to có hỗ trợ tiếng Việt không?
**A:** CÓ! Bạn có thể tùy chỉnh toàn bộ tin nhắn bằng tiếng Việt.

### Q: Mobile app có tốn data không?
**A:** RẤT ÍT! Chỉ ~10KB/tin nhắn.

---

## 🎉 KẾT QUẢ

Sau khi setup xong:
- ✅ User chat trên website
- ✅ Admin nhận notification tức thì
- ✅ Trả lời từ mobile app
- ✅ User nhận reply ngay lập tức
- ✅ Lịch sử chat được lưu vĩnh viễn
- ✅ Analytics chi tiết

**ĐIỂM SỐ ĐẠT ĐƯỢC: 1.0đ (Live chat support)** ⭐

---

## 📞 Support

Nếu gặp vấn đề:
1. Check Property ID và Widget ID đúng chưa
2. Restart frontend: `npm run dev`
3. Clear browser cache: Ctrl+Shift+Delete
4. Test trên Incognito mode
5. Check Tawk.to Dashboard → "Test installation"

**Chúc bạn setup thành công! 🚀**
