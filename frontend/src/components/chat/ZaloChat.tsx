import { useEffect } from 'react';

/**
 * Zalo Official Account Chat Plugin
 * Tích hợp chat Zalo vào website
 */
const ZaloChat = ({ oaId }: { oaId: string }) => {
  useEffect(() => {
    // Load Zalo SDK
    const loadZaloSDK = () => {
      const existingScript = document.getElementById('zalo-sdk');
      if (existingScript) return;

      const script = document.createElement('script');
      script.id = 'zalo-sdk';
      script.src = 'https://sp.zalo.me/plugins/sdk.js';
      script.async = true;
      document.body.appendChild(script);
    };

    loadZaloSDK();

    // Cleanup
    return () => {
      const zaloScript = document.getElementById('zalo-sdk');
      if (zaloScript) {
        zaloScript.remove();
      }
    };
  }, []);

  return (
    <div
      className="zalo-chat-widget"
      data-oaid={oaId}
      data-welcome-message="Xin chào! Tôi có thể giúp gì cho bạn?"
      data-autopopup="0"
      data-width="350"
      data-height="420"
    />
  );
};

export default ZaloChat;
