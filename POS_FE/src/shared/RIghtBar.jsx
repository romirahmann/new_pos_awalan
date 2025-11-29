/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";

export default function RightSidebar({ isOpen, onClose, children, title }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-[30rem] bg-gray-950 shadow-xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Header Close Button */}
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-gray-200 text-lg font-semibold">{title}</h3>
              <button
                onClick={onClose}
                className="px-3 py-1 text-red-400  rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
