/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md", // sm, md, lg, xl, full
  closeOnOverlay = true,
  hideHeader = false,
  hideFooter = false,
  className = "",
  bodyClass = "",
  headerClass = "",
  footerClass = "",
}) {
  if (!isOpen) return null;

  // Ukuran fleksibel
  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-[90vw] h-[90vh]",
  };

  // Close on ESC
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => closeOnOverlay && onClose()}
      >
        {/* Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full ${sizes[size]} max-h-[95vh] overflow-hidden flex flex-col ${className}`}
        >
          {/* Header */}
          {!hideHeader && (
            <div
              className={`flex justify-between items-center px-6 py-4 border-b dark:border-neutral-700 ${headerClass}`}
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {title}
              </h2>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Body */}
          <div
            className={`px-6 py-4 overflow-auto flex-1 text-gray-700 dark:text-gray-300 ${bodyClass}`}
          >
            {children}
          </div>

          {/* Footer */}
          {!hideFooter && footer && (
            <div
              className={`px-6 py-4 border-t dark:border-neutral-700 bg-neutral-800/10 ${footerClass}`}
            >
              {footer}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
