/* eslint-disable no-unused-vars */
import { FaExclamationTriangle } from "react-icons/fa";

export default function ConfirmDelete({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Modal Content */}
      <div className="relative bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full text-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <FaExclamationTriangle className="text-red-500 text-2xl" />
          <h2 className="text-lg font-semibold">
            {title || "Konfirmasi Hapus"}
          </h2>
        </div>

        <p className="text-sm mb-6">
          {message ||
            "Apakah kamu yakin ingin menghapus item ini? Tindakan ini tidak bisa dibatalkan."}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
