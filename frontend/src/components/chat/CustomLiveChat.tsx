import React, { useState } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import clsx from 'clsx';

/**
 * Custom Live Chat Component
 * Chat support tự xây dựng với giao diện tùy chỉnh
 */

interface Message {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: Date;
}

const CustomLiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'admin',
      text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Giả lập admin đang typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Giả lập phản hồi tự động
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'admin',
        text: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong giây lát.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          title="Chat với chúng tôi"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={clsx(
            'fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl transition-all duration-300',
            {
              'w-96 h-[500px]': !isMinimized,
              'w-96 h-16': isMinimized,
            }
          )}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">EduShop Support</h3>
                <p className="text-xs opacity-90">Trực tuyến</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-blue-700 p-1 rounded"
                title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-700 p-1 rounded"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="h-[360px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={clsx('flex', {
                      'justify-end': message.sender === 'user',
                      'justify-start': message.sender === 'admin',
                    })}
                  >
                    <div
                      className={clsx('max-w-[75%] rounded-lg p-3 shadow', {
                        'bg-blue-600 text-white': message.sender === 'user',
                        'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200':
                          message.sender === 'admin',
                      })}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={clsx('text-xs mt-1', {
                          'text-blue-200': message.sender === 'user',
                          'text-gray-500 dark:text-gray-400': message.sender === 'admin',
                        })}
                      >
                        {message.timestamp.toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CustomLiveChat;
