import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Extend Window interface for Crisp
declare global {
  interface Window {
    $crisp?: any[];
    CRISP_WEBSITE_ID?: string;
  }
}

/**
 * Crisp Chat Plugin
 * Plugin chat support chuyên nghiệp - MIỄN PHÍ 100%
 * 
 * ✅ Chỉ hiển thị khi đã login
 * ✅ Mỗi user có session chat riêng
 * ✅ Admin nhận tin nhắn qua Crisp mobile app
 * ✅ Hoạt động trên localhost
 * ✅ Miễn phí vĩnh viễn
 * 
 * Website ID: 297cb92c-8278-444b-b6cf-100308025c23
 */
const CrispChat = () => {
  const location = useLocation(); // Theo dõi route changes
  const { user, isAuthenticated } = useAuth(); // Lấy thông tin user

  // Khởi tạo Crisp khi user login
  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Nếu chưa login, ẩn widget
      if (window.$crisp) {
        window.$crisp.push(['do', 'chat:hide']);
      }
      return;
    }

    // Website ID từ Crisp Dashboard
    const CRISP_WEBSITE_ID = "297cb92c-8278-444b-b6cf-100308025c23";

    // Hàm khởi tạo Crisp
    const initializeCrisp = () => {
      // Kiểm tra script đã tồn tại chưa
      const existingScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
      
      if (existingScript && window.$crisp) {
        // Nếu đã có script, reset session cho user mới
        window.$crisp.push(['do', 'session:reset']);
        
        // Set thông tin user
        window.$crisp.push(['set', 'user:email', [user.email]]);
        window.$crisp.push(['set', 'user:nickname', [user.fullName]]);
        window.$crisp.push(['set', 'session:data', [[
          ['user_id', user.id],
          ['user_role', user.role]
        ]]]);
        
        // Show widget
        window.$crisp.push(['do', 'chat:show']);
        return;
      }

      // Setup Crisp lần đầu
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

      // Load Crisp script
      const script = document.createElement('script');
      script.src = 'https://client.crisp.chat/l.js';
      script.async = true;
      document.getElementsByTagName('head')[0].appendChild(script);

      // Tùy chỉnh khi load xong
      script.onload = () => {
        if (window.$crisp) {
          // Đặt ngôn ngữ tiếng Việt
          window.$crisp.push(['set', 'locale', 'vi']);
          
          // Set thông tin user
          window.$crisp.push(['set', 'user:email', [user.email]]);
          window.$crisp.push(['set', 'user:nickname', [user.fullName]]);
          window.$crisp.push(['set', 'session:data', [[
            ['user_id', user.id],
            ['user_role', user.role]
          ]]]);
          
          // Đảm bảo widget hiển thị
          window.$crisp.push(['do', 'chat:show']);
        }
      };
    };

    // Khởi tạo ngay lập tức
    initializeCrisp();

    // Cleanup khi logout
    return () => {
      if (!isAuthenticated && window.$crisp) {
        // Reset session và ẩn widget khi logout
        window.$crisp.push(['do', 'session:reset']);
        window.$crisp.push(['do', 'chat:hide']);
      }
    };
  }, [isAuthenticated, user]); // Chạy lại khi login/logout

  // Effect riêng để show/hide widget mỗi khi route thay đổi
  useEffect(() => {
    if (!isAuthenticated) return;

    const showTimeout = setTimeout(() => {
      if (window.$crisp) {
        window.$crisp.push(['do', 'chat:show']);
      }
    }, 500);

    return () => clearTimeout(showTimeout);
  }, [location.pathname, isAuthenticated]); // Chạy mỗi khi đổi page (nếu đã login)

  // Không render gì cả nếu chưa login
  if (!isAuthenticated) {
    return null;
  }

  return null; // Widget tự động hiển thị ở góc phải màn hình (chỉ khi đã login)
};

export default CrispChat;
