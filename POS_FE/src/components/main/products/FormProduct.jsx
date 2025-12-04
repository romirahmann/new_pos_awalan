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
    variants: [], // <-- variantGroup ada di sini
    addons: [],
  });

  const { showAlert } = useAlert();
  const [categories, setCategories] = useState([]);

  // Load categories
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

  // Load data edit ke form
  useEffect(() => {
    if (mode === "Edit" && initialData) {
      setFormData({
        productName: initialData.productName || "",
        categoryId: initialData.categoryId || "",
        price: initialData.price || "",
        cost: initialData.cost || "",
        productDesc: initialData.productDesc || "",
        isActive: initialData.isActive,
        variants: initialData.variants ?? [],
        addons: initialData.addons ?? [],
      });
    }
  }, [mode, initialData]);

  // =============== HANDLE INPUT ====================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= VARIANT =====================
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          variantValue: "",
          variantGroup: "",
          extraPrice: 0,
        },
      ],
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index][field] = value;
      return { ...prev, variants: updated };
    });
  };

  // ================= ADDONS =====================
  const addAddon = () => {
    setFormData((prev) => ({
      ...prev,
      addons: [...prev.addons, { addonName: "", price: 0 }],
    }));
  };

  const removeAddon = (index) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index),
    }));
  };

  const updateAddon = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.addons];
      updated[index][field] = value;
      return { ...prev, addons: updated };
    });
  };

  // ================= SUBMIT =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "Add") {
        await api.post("/master/products", formData);
      } else {
        await api.put(`/master/products/${initialData.productId}`, formData);
      }

      showAlert("success", `${mode} Product Successfully!`);
      onClose();
    } catch (error) {
      console.error(error);
      showAlert("error", `${mode} Product Failed!`);
    }
  };

  // ================= UI =====================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 rounded-lg text-gray-200"
    >
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Deskripsi Produk
        </label>
        <textarea
          name="productDesc"
          value={formData.productDesc}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 h-24"
        />
      </div>

      {/* VARIANTS */}
      <div>
        <label className="block text-sm font-medium mb-2">Variant</label>

        {formData.variants.map((variant, idx) => (
          <div key={`variant-${idx}`} className="flex gap-2 mb-2">
            <input
              type="text"
              value={variant.variantValue}
              onChange={(e) =>
                updateVariant(idx, "variantValue", e.target.value)
              }
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              placeholder="Contoh: Ice / Hot"
            />

            <input
              type="text"
              value={variant.variantGroup}
              onChange={(e) =>
                updateVariant(idx, "variantGroup", e.target.value)
              }
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              placeholder="Group Contoh: Temperature"
            />

            <input
              type="number"
              value={variant.extraPrice}
              onChange={(e) =>
                updateVariant(idx, "extraPrice", Number(e.target.value))
              }
              className="w-32 bg-gray-800 border border-gray-700 rounded px-3 py-2"
              placeholder="Extra"
            />

            <button
              type="button"
              onClick={() => removeVariant(idx)}
              className="px-3 py-2 bg-red-700 rounded hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="px-3 py-2 bg-blue-700 rounded hover:bg-blue-600 mt-2"
        >
          + Tambah Variant
        </button>
      </div>

      {/* ADDONS */}
      <div>
        <label className="block text-sm font-medium mb-2">Add-On</label>

        {formData.addons.map((addon, idx) => (
          <div key={`addon-${idx}`} className="flex gap-2 mb-2">
            <input
              type="text"
              value={addon.addonName}
              onChange={(e) => updateAddon(idx, "addonName", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              placeholder="Nama Add-On"
            />

            <input
              type="number"
              value={addon.price}
              onChange={(e) =>
                updateAddon(idx, "price", Number(e.target.value))
              }
              className="w-32 bg-gray-800 border border-gray-700 rounded px-3 py-2"
              placeholder="Harga"
            />

            <button
              type="button"
              onClick={() => removeAddon(idx)}
              className="px-3 py-2 bg-red-700 rounded hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addAddon}
          className="px-3 py-2 bg-blue-700 rounded hover:bg-blue-600 mt-2"
        >
          + Tambah Add-On
        </button>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <label>Status Aktif</label>
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Batal
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700"
        >
          {mode === "Add" ? "Tambahkan" : "Simpan"}
        </button>
      </div>
    </form>
  );
}
