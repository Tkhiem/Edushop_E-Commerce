import React, { useState } from 'react';
import { Facebook, Twitter, Link as LinkIcon, Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  title: string;
  description: string;
}

/**
 * Share Button Component
 * Cho phép chia sẻ lên Facebook, Twitter và copy link
 * Đáp ứng yêu cầu: Share Facebook với đầy đủ thông tin
 */
const ShareButton: React.FC<ShareButtonProps> = ({ url, title, description }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description);

  const handleFacebookShare = () => {
    // Facebook Share Dialog
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  const handleTwitterShare = () => {
    // Twitter Share
    const twitterUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Share Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        title="Chia sẻ khóa học"
      >
        <Share2 className="w-5 h-5" />
        <span>Chia sẻ</span>
      </button>

      {/* Share Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu - Auto position left or right based on screen space */}
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden sm:left-auto sm:right-0 sm:transform-none">
            {/* Facebook */}
            <button
              onClick={handleFacebookShare}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">Chia sẻ lên Facebook</span>
            </button>

            {/* Twitter */}
            <button
              onClick={handleTwitterShare}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-t"
            >
              <Twitter className="w-5 h-5 text-sky-500" />
              <span className="text-gray-700 font-medium">Chia sẻ lên Twitter</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-t"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">Đã sao chép!</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Sao chép liên kết</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
