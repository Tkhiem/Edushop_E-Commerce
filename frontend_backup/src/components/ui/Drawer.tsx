// components/ui/Drawer.tsx
import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: "left" | "right" | "bottom";
  width?: string;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  position = "right",
  width = "w-64",
  className = "",
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const drawerVariants = {
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
    },
    left: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
    },
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" },
    },
  };

  const positionClasses = {
    right: `right-0 top-0 h-full ${width}`,
    left: `left-0 top-0 h-full ${width}`,
    bottom: `bottom-0 left-0 w-full h-1/2`,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="drawer-wrapper"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="overlay"
            className="absolute inset-0 bg-gray-300/80 backdrop-blur-md dark:bg-gray-300/30"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-full p-3 shadow bg-white mt-5 ml-20 active:bg-red-600/20"
              >
                <MdClose className="w-5 h-5 text-gray-500 dark:text-gray-300 active:text-red-600" />
              </button>
            )}
          </motion.div>

          {/* Drawer content */}
          <motion.div
            key="drawer-content"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={drawerVariants[position]}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={clsx(
              "absolute bg-white dark:bg-gray-700 shadow-lg",
              positionClasses[position],
              className
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
