/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";

export function ConfirmNewTransactionModal({ isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center 
          bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl 
            w-[90%] sm:w-[420px] p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center mb-3">
              <FaRegQuestionCircle className="text-4xl text-blue-500" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">
              Buat Transaksi Baru?
            </h2>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-white text-white transition"
              >
                Batal
              </button>

              <button
                onClick={onConfirm}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 
                text-white shadow-md transition"
              >
                Ya, Buat Baru
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
