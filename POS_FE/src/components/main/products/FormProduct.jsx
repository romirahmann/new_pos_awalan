/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import api from "../../../services/axios.service";
import { useAlert } from "../../../store/AlertContext";

export default function FormProduct({ mode, initialData, onClose }) {
  const [formData, setFormData] = useState({
    productName: "",
    categoryId: "",
    price: "",
    cost: "",
    productDesc: "",
    isActive: true,
  });
  const { showAlert } = useAlert();
  const [categories, setCategories] = useState([]);

  // Fetch Kategori dari API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/master/categories");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Gagal memuat kategori:", error);
      }
    };
    fetchCategories();
  }, []);

  // Set data saat Edit
  useEffect(() => {
    if (mode === "Edit" && initialData) {
      setFormData({
        productName: initialData.productName || "",
        categoryId: initialData.categoryId || "",
        price: initialData.price || "",
        cost: initialData.cost || "",
        productDesc: initialData.productDesc || "",
        isActive: initialData.isActive,
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "Add") {
        await api.post("/master/product", formData);
      } else {
        await api.put(`/master/product/${initialData.productId}`, formData);
      }
      showAlert(`success`, `${mode} Product Successfully!`);
      onClose();
    } catch (error) {
      console.error(error);
      showAlert("error", `${mode} Product Failed!`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg max-w-md mx-auto text-gray-200"
    >
      {/* Nama Produk */}
      <div>
        <label className="block text-sm font-medium mb-1">Nama Produk</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
          required
        />
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-sm font-medium mb-1">Kategori</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
          required
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      {/* Harga (Price) */}
      <div>
        <label className="block text-sm font-medium mb-1">Harga Jual</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
          required
        />
      </div>

      {/* Harga Modal (Cost) */}
      <div>
        <label className="block text-sm font-medium mb-1">Harga Modal</label>
        <input
          type="number"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
          required
        />
      </div>

      {/* Deskripsi Produk */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Deskripsi Produk
        </label>
        <textarea
          name="productDesc"
          value={formData.productDesc}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 h-24"
          placeholder="Masukkan keterangan atau detail produk..."
        />
      </div>

      {/* Status Aktif */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-700 bg-gray-800 border-gray-700"
        />
        <label>Status Aktif</label>
      </div>

      {/* Tombol */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 transition"
        >
          {mode === "Add" ? "Tambahkan" : "Simpan"}
        </button>
      </div>
    </form>
  );
}
