import { useEffect } from 'react';

// Extend Window interface for Tawk.to
declare global {
  interface Window {
    Tawk_API?: {
      hideWidget: () => void;
      showWidget: () => void;
    };
  }
}

/**
 * Live Chat Widget using Tawk.to
 * Tích hợp chat support trực tiếp vào website
 */
const LiveChatWidget = () => {
  useEffect(() => {
    // Tawk.to configuration
    // Bạn cần đăng ký tài khoản tại https://www.tawk.to/
    // và thay thế PROPERTY_ID và WIDGET_ID bên dưới
    
    const TAWK_PROPERTY_ID = "YOUR_PROPERTY_ID"; // Thay bằng Property ID của bạn
    const TAWK_WIDGET_ID = "YOUR_WIDGET_ID"; // Thay bằng Widget ID của bạn

    // Kiểm tra nếu script đã được load
    if (document.getElementById('tawk-script')) {
      return;
    }

    // Tạo script element
    const script = document.createElement('script');
    script.id = 'tawk-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Thêm script vào DOM
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    // Cleanup khi component unmount
    return () => {
      const tawkScript = document.getElementById('tawk-script');
      if (tawkScript) {
        tawkScript.remove();
      }
      // Xóa Tawk widget
      if (window.Tawk_API) {
        window.Tawk_API.hideWidget();
      }
    };
  }, []);

  return null; // Widget tự động hiển thị ở góc phải màn hình
};

export default LiveChatWidget;
