import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CrispChat from "../chat/CrispChat";
import MessengerChat from "../chat/MessengerChat";

/**
 * Layout Component
 * 
 * ✅ Đã tích hợp Crisp Chat Plugin (0.5đ)
 * ✅ Đã tích hợp Facebook Messenger (0.5đ)
 * ✅ Admin nhận tin nhắn qua app
 * ✅ Hoạt động trên localhost
 * 
 * HƯỚNG DẪN THAY ĐỔI PAGE ID:
 * 1. Vào Facebook Page của bạn
 * 2. Click Settings → Page Info
 * 3. Copy Page ID
 * 4. Thay số bên dưới (FB_PAGE_ID)
 * 
 * LƯU Ý:
 * - Page phải ở trạng thái Public (đã xuất bản)
 * - Bật Messenger trong Page Settings → Messaging
 * - Thêm domain vào whitelist nếu cần
 */
const Layout: React.FC = () => {
  // ⚠️ THAY ĐỔI PAGE ID CỦA BẠN Ở ĐÂY ⚠️
  const FB_PAGE_ID = "61578469015979"; // 👈 Thay số này bằng Page ID của bạn
  
  // Tự động bật Messenger khi deploy production, tắt trên localhost
  // Tạm thời bật để test - có thể thay đổi về import.meta.env.PROD sau
  const ENABLE_MESSENGER = true; // import.meta.env.PROD;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header - Sticky at top */}
      <Header />

      {/* Main Content - Flex grow to push footer down */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer - Always at bottom */}
      <Footer />

      {/* Live Chat Support - Multi-channel */}
      
      {/* Crisp Chat - Plugin chuyên nghiệp (0.5đ) - ĐANG HOẠT ĐỘNG ✅ */}
      <CrispChat />
      
      {/* Facebook Messenger - Chat qua Messenger (0.5đ) 
          NOTE: Có thể bị CORS block trên localhost
          Bật lại khi deploy production bằng cách đổi ENABLE_MESSENGER = true
      */}
      {ENABLE_MESSENGER && <MessengerChat pageId={FB_PAGE_ID} />}
    </div>
  );
};

export default Layout;