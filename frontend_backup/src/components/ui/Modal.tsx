import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";
import { MdClose } from "react-icons/md";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  className = "",
  overlayClassName = "",
  closeOnOverlayClick = true,
  closeOnEsc = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEsc, onClose]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (open) {
      setIsVisible(true);
    } else {
      timeout = setTimeout(() => setIsVisible(false), 200);
    }
    return () => clearTimeout(timeout);
  }, [open]);

  if (!open && !isVisible) return null;

  const modalContent = (
    <div
      className={clsx(
        "fixed inset-0 z-[1000] flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-200",
        overlayClassName,
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        className={clsx(
          "w-full mx-4 sm:min-w-gl md:min-w-2xl",
          "transform transition-all duration-200",
          open
            ? "bg-white opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4",
          "max-h-[90vh]",
          "bg-background text-foreground rounded-lg shadow-lg relative",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="px-6 pt-5 pb-3 text-lg font-semibold">{title}</div>
        )}
        <div className="px-6 py-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="relative">
            <div className="absolute -top-9 left-0 w-full h-10 pointer-events-none bg-gradient-to-t from-white dark:from-gray-700 to-transparent" />
            <div className="px-6 pt-2 pb-4">{footer}</div>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted hover:text-red-600 transition hover:bg-red-300/20 rounded p-1"
          aria-label="Close"
        >
          <MdClose className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
