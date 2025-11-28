import { useEffect } from 'react';

// Extend Window interface for Facebook SDK
declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: {
      init: (params: { 
        xfbml: boolean; 
        version: string;
        appId?: string;
      }) => void;
      XFBML?: {
        parse: () => void;
      };
      CustomerChat?: {
        show: () => void;
        hide: () => void;
      };
    };
  }
}

/**
 * Facebook Messenger Chat Plugin
 * Tích hợp chat Messenger vào website (0.5đ)
 * 
 * ⚠️ YÊU CẦU QUAN TRỌNG:
 * 1. Page Facebook phải đã PUBLISHED (Public) - không phải Draft
 * 2. Vào Page Settings → Messaging:
 *    - Bật "Show a Messenger greeting"
 *    - Bật "Allow people to contact my Page privately"
 * 3. Page Settings → Advanced Messaging:
 *    - Thêm domain vào whitelist (nếu production)
 * 
 * ⏱️ Widget có thể mất 5-10 giây để load lần đầu
 * 
 * NOTE: Page ID 61578469015979 là Page Profile ID, có thể cần Page Business ID
 * Kiểm tra tại: https://www.facebook.com/61578469015979/about
 */
const MessengerChat = ({ pageId }: { pageId: string }) => {
  useEffect(() => {
    console.log('[Messenger] 🚀 Initializing with Page ID:', pageId);
    console.log('[Messenger] 📌 Verify page exists: https://www.facebook.com/' + pageId);

    // Kiểm tra nếu đã có SDK rồi thì chỉ parse lại
    if (window.FB) {
      console.log('[Messenger] ♻️ SDK already exists, re-parsing...');
      if (window.FB.XFBML) {
        window.FB.XFBML.parse();
      }
      return;
    }

    // Xóa các phần tử cũ nếu có
    const existingScript = document.getElementById('facebook-jssdk');
    if (existingScript) {
      console.log('[Messenger] 🗑️ Removing old script');
      existingScript.remove();
    }

    // Tạo fb-root nếu chưa có
    if (!document.getElementById('fb-root')) {
      console.log('[Messenger] 📦 Creating fb-root');
      const fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.insertBefore(fbRoot, document.body.firstChild);
    }

    // Facebook SDK initialization
    window.fbAsyncInit = function () {
      console.log('[Messenger] ✅ FB SDK initialized');
      if (window.FB) {
        window.FB.init({
          xfbml: true,
          version: 'v19.0', // Sử dụng phiên bản ổn định
        });
        
        console.log('[Messenger] 🔄 Parsing XFBML elements...');
        
        // Đợi DOM sẵn sàng trước khi parse
        setTimeout(() => {
          const chatElement = document.querySelector('.fb-customerchat');
          console.log('[Messenger] 🔍 Chat element:', chatElement ? '✅ Found' : '❌ Not found');
          
          if (chatElement) {
            const currentPageId = chatElement.getAttribute('data-page-id');
            console.log('[Messenger] 📋 Current Page ID:', currentPageId);
            console.log('[Messenger] 🔗 Page URL: https://www.facebook.com/' + currentPageId);
          }
          
          if (window.FB?.XFBML) {
            window.FB.XFBML.parse();
            console.log('[Messenger] ✨ Widget parsed - Facebook is rendering...');
            console.log('[Messenger] ⏱️ Please wait 5-10 seconds for widget to appear');
            
            // Kiểm tra sau 8 giây (Facebook cần thời gian)
            setTimeout(() => {
              const iframes = document.querySelectorAll('iframe[title*="Messenger"], iframe[title*="Facebook"]');
              console.log('[Messenger] 🔍 Facebook iframes found:', iframes.length);
              
              if (iframes.length === 0) {
                console.warn('[Messenger] ⚠️ Widget not visible yet!');
                console.warn('[Messenger] 💡 CHECKLIST:');
                console.warn('   ✓ Page ID đúng? Check: https://www.facebook.com/' + pageId);
                console.warn('   ✓ Page đã PUBLISHED (Public)?');
                console.warn('   ✓ Messenger Settings → "Allow people to contact" = ON?');
                console.warn('   ✓ Network: Facebook có bị chặn không?');
                console.warn('   ✓ Thử refresh trang và đợi 10 giây');
              } else {
                console.log('[Messenger] ✅ SUCCESS! Widget rendered!');
                console.log('[Messenger] 👀 Look for blue Messenger bubble in bottom-right corner');
              }
            }, 8000);
          }
        }, 1000); // Tăng delay lên 1 giây để DOM chắc chắn sẵn sàng
      }
    };

    // Load Facebook SDK - Sử dụng SDK chính thức
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/vi_VN/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      console.log('[Messenger] 📥 SDK loaded successfully');
    };

    script.onerror = () => {
      console.error('[Messenger] ❌ Failed to load Facebook SDK');
      console.error('[Messenger] ⚠️ COMMON ISSUES:');
      console.error('   1. Facebook blocked by Ad Blocker → Turn off uBlock/AdBlock');
      console.error('   2. Network/Firewall blocking Facebook → Check your network');
      console.error('   3. VPN interfering → Try without VPN');
      console.error('   4. localhost limitation → Facebook may not work on localhost');
      console.error('');
      console.error('[Messenger] 💡 SOLUTION: Use Crisp Chat instead (already working!)');
      console.error('[Messenger] 💡 Or deploy to production domain to test Messenger');
    };

    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
      console.log('[Messenger] 📝 Customer Chat SDK script inserted');
    }

    // Cleanup - KHÔNG xóa để tránh mất widget khi re-render
    return () => {
      console.log('[Messenger] 🧹 Cleanup (widget persists)');
    };
  }, [pageId]);

  if (!pageId || pageId === 'YOUR_PAGE_ID') {
    console.error('[Messenger] ❌ INVALID PAGE ID!');
    console.error('[Messenger] 💡 Go to: frontend/src/components/layout/Layout.tsx');
    console.error('[Messenger] 💡 Change FB_PAGE_ID to your real Page ID');
    return null;
  }

  console.log('[Messenger] 🎨 Rendering widget element for Page:', pageId);

  return (
    <>
      {/* Facebook Messenger Customer Chat Widget 
          Docs: https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin
      */}
      <div
        className="fb-customerchat"
        data-page-id={pageId}
        data-theme-color="#0084ff"
        data-logged-in-greeting="Xin chào! Chúng tôi có thể giúp gì cho bạn? 😊"
        data-logged-out-greeting="Xin chào! Chúng tôi có thể giúp gì cho bạn? 😊"
        data-greeting-dialog-display="show"
        data-greeting-dialog-delay="3"
      />
    </>
  );
};

export default MessengerChat;
