import { mockProducts } from "@/data/products";
import { useProductActions } from "@/hooks/useProductActions";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { MdClose } from "react-icons/md";
import ProductChatCard from "../product/ProductChatCard";
import ProductDetailModal from "../product/ProductDetailModal";
import { Input } from "../ui/Input";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  productId?: string;
}

const ChatPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  //   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  //   const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    handleToggleFavorite,
    handleViewDetail,
    isFavorite,
    selectedProduct,
    setSelectedProduct,
  } = useProductActions();

  useEffect(() => {
    const container = messagesRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const saved = localStorage.getItem("chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Lỗi khi load lịch sử chat:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/gemma`,
        {
          message: input,
        }
      );

      console.log(data.aiReply);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.aiReply.text,
        productId: data.aiReply.productId ?? null,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Gemma error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Lỗi kết nối với trợ lý AI." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleShowProduct = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      handleViewDetail(product);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-xl w-[350px] h-[500px] flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-primary text-white px-4 py-2 flex justify-between items-center">
          <div className="flex gap-2">
            <img
              src="https://plus.unsplash.com/premium_photo-1682023587356-86065925727a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hhdGJvdHxlbnwwfHwwfHx8MA%3D%3D"
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <h3 className="text-lg font-semibold">Chat AI</h3>
          </div>
          <button onClick={onClose}>
            <MdClose className="w-5 h-5 hover:scale-110 transition" />
          </button>
        </div>

        {/* Message Area */}
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 overflow-x-hidden"
        >
          {messages.map((message, index) => (
            <div key={index}>
              <div
                className={clsx(
                  "rounded-xl px-4 py-2 max-w-[75%] mb-2",
                  message.role === "user"
                    ? "bg-primary text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-800 self-start mr-auto"
                )}
              >
                <div dangerouslySetInnerHTML={{ __html: message.content }} />
              </div>
              {message.productId &&
                (() => {
                  const product = mockProducts.find(
                    (p) => p.id === message.productId
                  );
                  if (!product) return null;

                  return (
                    <ProductChatCard
                      product={product}
                      onClick={() => handleShowProduct(product.id)}
                    />
                  );
                })()}
            </div>
          ))}

          {/* {messages.map((message, index) => (
            <div
              key={index}
              className={clsx(
                "rounded-xl px-4 py-2 max-w-[75%] mb-2",
                message.role === "user"
                  ? "bg-primary text-white self-end ml-auto"
                  : "bg-gray-200 text-gray-800 self-start mr-auto"
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: message.content }} />
              {message.productId && (
                <button
                  onClick={() => handleShowProduct(message.productId!)}
                  className="text-sm text-primary underline"
                >
                  Xem chi tiết
                </button>
              )}
            </div>
          ))} */}

          {isTyping && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 animate-pulse">
              <span className="w-3 h-3 rounded-full bg-primary animate-bounce" />
              <span>Trợ lý đang trả lời...</span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 flex gap-2 items-center">
          <Input
            placeholder="Aa"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border-none bg-gray-200 rounded-full"
          />

          <IoMdSend
            className="w-6 h-6 hover:scale-110 transition-transform text-primary"
            onClick={handleSend}
          />
        </div>
      </div>
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          isLiked={isFavorite(selectedProduct.id)}
          onLikeClick={handleToggleFavorite}
        />
      )}
    </>
  );
};

export default ChatPanel;
