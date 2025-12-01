/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import RightSidebar from "../../../shared/RIghtBar";
import api from "../../../services/axios.service";
import { listenToUpdate } from "../../../services/socket.service";

export function MenuSection({ cart, setCart }) {
  const [products, setProducts] = useState([]);

  const [rightBar, setRightBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [categoryItem, setCategoryItem] = useState([]);
  const fetchProduct = useCallback(async () => {
    try {
      let res = await api.get("/master/products");
      setProducts(res?.data?.data || []);
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchProduct();
    ["product:created", "product:updated", "product:deleted"].forEach((event) =>
      listenToUpdate(event, fetchProduct)
    );
  }, [fetchProduct]);

  // Fetch Kategori dari API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/master/categories");
        setCategoryItem(res.data.data);
      } catch (error) {
        console.error("Gagal memuat kategori:", error);
      }
    };
    fetchCategories();
  }, []);

  const categories = ["All", ...categoryItem.map((cat) => cat.categoryName)];

  // helpers
  const safeNumber = (v) => {
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  };

  const addonsTotal = (addons) => {
    return (addons || []).reduce((s, a) => s + safeNumber(a.price), 0);
  };

  const addonsSignature = (addons) => {
    if (!addons || addons.length === 0) return "no-addons";
    return addons
      .map((a) => `${a.name || ""}:${safeNumber(a.price)}`)
      .join("|");
  };

  const computeCartItemId = (item) => {
    const sig = addonsSignature(item.addOns);
    const note = (item.note || "").replace(/\s+/g, "_");
    const variant = item.variant || "no-variant";
    return `${item.productId}-${variant}-${sig}-${note}`;
  };

  // filter
  const filteredMenu = products.filter(
    (item) =>
      (activeCategory === "All" || item.categoryName === activeCategory) &&
      item?.productName?.toLowerCase().includes(searchTerm.toLowerCase() || "")
  );

  // open detail with safe defaults
  const handleProductDetail = (item) => {
    setSelectedItem({
      ...item,
      qty: 1,
      variant: item.variants ? item.variants[0] : null,
      note: "",
      addOns: [],
    });
    setRightBar(true);
  };

  // add empty addon row
  const addAddon = () =>
    setSelectedItem((prev) => ({
      ...prev,
      addOns: [...(prev.addOns || []), { id: Date.now(), name: "", price: 0 }],
    }));

  // update addon by index
  const updateAddon = (index, field, value) =>
    setSelectedItem((prev) => {
      const newAddons = [...(prev.addOns || [])];
      newAddons[index] = {
        ...newAddons[index],
        [field]: field === "price" ? safeNumber(value) : value,
      };
      return { ...prev, addOns: newAddons };
    });

  // remove addon by index
  const removeAddon = (index) =>
    setSelectedItem((prev) => ({
      ...prev,
      addOns: (prev.addOns || []).filter((_, i) => i !== index),
    }));

  // update qty
  const updateQty = (delta) =>
    setSelectedItem((prev) => ({
      ...prev,
      qty: Math.max(1, (prev.qty || 1) + delta),
    }));

  // calculate final price for the selected item (including addons)
  const selectedFinalPrice = () => {
    if (!selectedItem) return 0;
    const base = safeNumber(selectedItem.price);
    const add = addonsTotal(selectedItem.addOns);
    return (base + add) * (selectedItem.qty || 1);
  };

  // add to cart (merge if same cartItemId exists)
  const addToCart = (item) => {
    const cartItemId = computeCartItemId(item);
    const basePrice = safeNumber(item.price) + addonsTotal(item.addOns);
    const newItem = {
      cartItemId,
      productId: item.productId,
      productName: item.productName,
      price: basePrice,
      qty: item.qty || 1,
      variant: item.variant || null,
      note: item.note || "",
      categoryName: item.categoryName,
      addOns: item.addOns || [],
      totalPrice: basePrice * (item.qty || 1),
    };

    setCart((prev) => {
      const exists = prev.find((c) => c.cartItemId === cartItemId);
      if (!exists) return [...prev, newItem];
      // merge qty
      return prev.map((c) =>
        c.cartItemId === cartItemId
          ? {
              ...c,
              qty: c.qty + newItem.qty,
              totalPrice: (c.qty + newItem.qty) * c.price,
            }
          : c
      );
    });

    setRightBar(false);
    setSelectedItem(null);
  };

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg flex flex-col overflow-hidden">
      {/* Search & Category */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Cari menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-gray-200"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm rounded-full transition-all shadow ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-3 gap-3">
        {filteredMenu.map((item) => (
          <motion.button
            key={item.productId}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleProductDetail(item)}
            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl shadow text-left transition"
          >
            <h3 className="font-semibold">{item.productName}</h3>
            <p className="text-xs text-gray-400">{item.categoryName}</p>
            <p className="font-bold text-blue-400 mt-1">
              Rp {safeNumber(item.price).toLocaleString()}
            </p>
          </motion.button>
        ))}
      </div>

      {/* RIGHT SIDEBAR */}
      {selectedItem && (
        <RightSidebar
          isOpen={rightBar}
          title={"Detail Order"}
          onClose={() => {
            setRightBar(false);
            setSelectedItem(null);
          }}
        >
          <div className="flex flex-col h-full text-gray-200">
            {/* Header */}
            <div className="px-5">
              <h2 className="text-2xl font-bold">{selectedItem.productName}</h2>
              <p className="text-sm text-gray-400 mb-2">
                {selectedItem.categoryName}
              </p>
              <p className="text-xl font-semibold text-blue-400 mb-4">
                Rp {safeNumber(selectedItem.price).toLocaleString()}
              </p>
            </div>

            {/* QTY */}
            <div className="px-5 mb-4">
              <label className="text-sm mb-2 block">Jumlah</label>
              <div className="flex items-center justify-between bg-gray-700 px-4 py-2 rounded-lg">
                <button onClick={() => updateQty(-1)} className="text-2xl">
                  −
                </button>
                <span className="text-lg font-semibold">
                  {selectedItem.qty}
                </span>
                <button onClick={() => updateQty(1)} className="text-2xl">
                  +
                </button>
              </div>
            </div>

            {/* Variant */}
            {selectedItem.variants && (
              <div className="px-5 mb-4">
                <label className="text-sm mb-2 block">Pilih Variant</label>
                <div className="space-y-2">
                  {selectedItem.variants.map((variant) => (
                    <label
                      key={variant}
                      className="flex items-center gap-3 bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-600"
                    >
                      <input
                        type="radio"
                        name="variant"
                        value={variant}
                        checked={selectedItem.variant === variant}
                        onChange={() =>
                          setSelectedItem((p) => ({ ...p, variant }))
                        }
                      />
                      <span>{variant}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Add-Ons Manual */}
            <div className="px-4 mx-5 mb-4 bg-gray-700 p-3 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Add-On Manual</span>
                <button
                  onClick={addAddon}
                  className="text-sm bg-blue-600 px-2 py-1 rounded"
                >
                  + Add
                </button>
              </div>

              {(selectedItem.addOns || []).map((addon, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nama Add-on"
                    value={addon.name}
                    onChange={(e) => updateAddon(idx, "name", e.target.value)}
                    className="flex-1 p-2 bg-gray-600 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Harga"
                    value={addon.price}
                    onChange={(e) => updateAddon(idx, "price", e.target.value)}
                    className="w-28 p-2 bg-gray-600 rounded"
                  />
                  <button
                    onClick={() => removeAddon(idx)}
                    className="text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="px-5 mb-4">
              <label className="text-sm mb-2 block">Catatan</label>
              <textarea
                placeholder="Tanpa gula, ekstra es, dll..."
                value={selectedItem.note}
                onChange={(e) =>
                  setSelectedItem((p) => ({ ...p, note: e.target.value }))
                }
                className="w-full p-3 bg-gray-700 rounded-lg"
                rows="3"
              />
            </div>

            {/* Total & Add */}
            <div className="mt-auto p-5 border-t border-gray-700">
              <div className="flex justify-between font-semibold mb-3">
                <span>Total</span>
                <span className="text-blue-400 text-lg">
                  Rp {selectedFinalPrice().toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => addToCart(selectedItem)}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 mt-4 rounded-lg font-semibold text-white"
              >
                Tambah ke Pesanan
              </button>
            </div>
          </div>
        </RightSidebar>
      )}
    </div>
  );
}
