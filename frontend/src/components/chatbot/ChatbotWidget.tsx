import React, { useState } from "react";
import clsx from "clsx";
import Button from "../ui/Button";
import { MdClose } from "react-icons/md";
import { LuBotMessageSquare } from "react-icons/lu";
import ChatPanel from "./ChatPanel";

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div
          className={clsx(
            "fixed bottom-24 right-6 z-50 transition-all duration-300",
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90 pointer-events-none"
          )}
        >
          <ChatPanel onClose={() => setIsOpen(false)} />
        </div>
      )}

      <Button
        className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-primary text-white hover:scale-105 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <MdClose className="w-6 h-6" />
        ) : (
          <LuBotMessageSquare className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};

export default ChatbotWidget;
