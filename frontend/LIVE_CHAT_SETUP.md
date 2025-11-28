# 📞 Hướng dẫn Tích hợp Live Chat Support

## 🎯 Tổng quan

Dự án hỗ trợ 2 loại Live Chat:
1. **Custom Live Chat** - Chat tự xây dựng (UI đẹp, tùy chỉnh cao)
2. **Tawk.to Integration** - Plugin chat miễn phí, chuyên nghiệp

---

## ✅ Cách 1: Custom Live Chat (Đã tích hợp sẵn)

### Tính năng:
- ✅ Giao diện đẹp, responsive
- ✅ Dark mode support
- ✅ Animation mượt mà
- ✅ Tự động phản hồi (có thể kết nối API sau)
- ✅ Hiển thị typing indicator
- ✅ Thu nhỏ/Mở rộng chat window

### Sử dụng:
```tsx
import CustomLiveChat from '@/components/chat/CustomLiveChat';

// Trong Layout hoặc App.tsx
<CustomLiveChat />
```

### Kết nối Backend (Nâng cao):
Để chat hoạt động thật, cần:
1. Tạo WebSocket server (Socket.io)
2. Tạo API endpoint để lưu tin nhắn
3. Admin dashboard để nhân viên trả lời

---

## ✅ Cách 2: Tawk.to Plugin (Khuyến nghị - Miễn phí)

### Bước 1: Đăng ký Tawk.to
1. Truy cập: https://www.tawk.to/
2. Đăng ký tài khoản miễn phí
3. Tạo Property mới (Website của bạn)
4. Lấy **Property ID** và **Widget ID**

### Bước 2: Cấu hình
Mở file `frontend/src/components/chat/LiveChatWidget.tsx`:
```tsx
const TAWK_PROPERTY_ID = "YOUR_PROPERTY_ID"; // Thay bằng ID của bạn
const TAWK_WIDGET_ID = "YOUR_WIDGET_ID"; // Thay bằng Widget ID
```

### Bước 3: Thêm vào App
```tsx
import LiveChatWidget from '@/components/chat/LiveChatWidget';

// Trong Layout.tsx hoặc App.tsx
<LiveChatWidget />
```

### Ưu điểm Tawk.to:
- ✅ Hoàn toàn miễn phí
- ✅ Mobile app để admin trả lời
- ✅ Lưu lịch sử chat
- ✅ Nhiều agent cùng trả lời
- ✅ Tùy chỉnh giao diện
- ✅ Analytics và báo cáo
- ✅ Không giới hạn số lượng chat

---

## ✅ Cách 3: Facebook Messenger Chat Plugin

### Bước 1: Tạo Facebook App
1. Truy cập: https://developers.facebook.com/
2. Tạo App mới → Business
3. Thêm "Messenger" product
4. Lấy **Page ID** của fanpage

### Bước 2: Thêm Messenger Plugin
```tsx
// MessengerChat.tsx
import { useEffect } from 'react';

const MessengerChat = () => {
  useEffect(() => {
    // Facebook SDK
    window.fbAsyncInit = function() {
      FB.init({
        xfbml: true,
        version: 'v18.0'
      });
    };

    // Load SDK
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  return (
    <>
      <div id="fb-root"></div>
      <div 
        className="fb-customerchat"
        attribution="setup_tool"
        page_id="YOUR_PAGE_ID" // Thay bằng Page ID của bạn
        theme_color="#0084ff"
        logged_in_greeting="Xin chào! Chúng tôi có thể giúp gì cho bạn?"
        logged_out_greeting="Xin chào! Chúng tôi có thể giúp gì cho bạn?"
      />
    </>
  );
};

export default MessengerChat;
```

---

## ✅ Cách 4: Zalo Chat Plugin

### Bước 1: Đăng ký Zalo Official Account
1. Truy cập: https://oa.zalo.me/
2. Đăng ký Official Account
3. Lấy **OA ID**

### Bước 2: Thêm Zalo Plugin
```tsx
// ZaloChat.tsx
import { useEffect } from 'react';

const ZaloChat = () => {
  useEffect(() => {
    // Zalo SDK
    const script = document.createElement('script');
    script.src = 'https://sp.zalo.me/plugins/sdk.js';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div 
      className="zalo-chat-widget"
      data-oaid="YOUR_OA_ID" // Thay bằng OA ID của bạn
      data-welcome-message="Xin chào! Tôi có thể giúp gì cho bạn?"
      data-autopopup="0"
      data-width="350"
      data-height="420"
    />
  );
};

export default ZaloChat;
```

---

## 🚀 Khuyến nghị Triển khai

### Cho Startup/Dự án nhỏ:
**→ Dùng Tawk.to** (Miễn phí, đầy đủ tính năng, dễ setup)

### Cho Doanh nghiệp ở Việt Nam:
**→ Dùng Zalo OA** (Người Việt quen dùng Zalo, tích hợp dễ)

### Cho E-commerce quốc tế:
**→ Dùng Facebook Messenger** (Phổ biến toàn cầu)

### Cho dự án cần tùy chỉnh cao:
**→ Xây dựng Custom Chat** (Cần backend + WebSocket)

---

## 📋 So sánh Chi tiết

| Tính năng | Custom Chat | Tawk.to | FB Messenger | Zalo OA |
|-----------|-------------|---------|--------------|---------|
| **Chi phí** | Phát triển cao | Miễn phí | Miễn phí | Miễn phí (Basic) |
| **Tùy chỉnh UI** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Mobile App** | Cần phát triển | ✅ Có sẵn | ✅ FB App | ✅ Zalo App |
| **Lưu lịch sử** | Cần backend | ✅ Tự động | ✅ Tự động | ✅ Tự động |
| **Nhiều agent** | Cần code | ✅ Unlimited | ✅ Có | ✅ Có (giới hạn) |
| **Analytics** | Cần tích hợp | ✅ Có sẵn | ✅ Có sẵn | ✅ Có sẵn |
| **Offline message** | Cần code | ✅ Có | ✅ Có | ✅ Có |
| **File sharing** | Cần code | ✅ Có | ✅ Có | ✅ Có |
| **User tracking** | Cần code | ✅ Có | ✅ Có | ✅ Có |
| **Setup time** | 2-3 tuần | 10 phút | 15 phút | 20 phút |

---

## 💡 Gợi ý Kết hợp

**Tối ưu nhất:** Dùng cả 2-3 kênh
```tsx
// App.tsx hoặc Layout.tsx
import LiveChatWidget from '@/components/chat/LiveChatWidget'; // Tawk.to
import MessengerChat from '@/components/chat/MessengerChat'; // Facebook
import ZaloChat from '@/components/chat/ZaloChat'; // Zalo

function App() {
  return (
    <>
      {/* Your app content */}
      
      {/* Multi-channel chat support */}
      <LiveChatWidget /> {/* Tawk.to - Chat web */}
      <MessengerChat /> {/* Facebook - Chat Messenger */}
      <ZaloChat /> {/* Zalo - Chat Zalo */}
    </>
  );
}
```

---

## 📞 Liên hệ Support

Nếu cần hỗ trợ tích hợp:
1. Kiểm tra documentation của từng platform
2. Test kỹ trên mobile và desktop
3. Đảm bảo không conflict giữa các widget

**Chúc bạn triển khai thành công! 🎉**
