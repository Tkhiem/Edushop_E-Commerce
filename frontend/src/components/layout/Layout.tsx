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
  
  // Bật cả Messenger và một fallback chat button đơn giản
  const ENABLE_MESSENGER = true;

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
      
      {/* Facebook Messenger - Chat qua Messenger (0.5đ) */}
      {ENABLE_MESSENGER && <MessengerChat pageId={FB_PAGE_ID} />}
      
      {/* Messenger Button - cùng kích thước và kiểu với Crisp */}
      <div className="fixed bottom-24 right-4 z-50">
        <button
          onClick={() => window.open('https://m.me/61578469015979', '_blank')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center group"
          title="Chat với chúng tôi qua Messenger"
        >
          <svg 
            className="w-7 h-7 transition-transform group-hover:scale-110" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.1l3.13 3.26L19.764 8.1l-6.573 6.863z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Layout;