/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import RightSidebar from "../../../shared/RIghtBar";
import api from "../../../services/axios.service";
import { listenToUpdate } from "../../../services/socket.service";
import { useAlert } from "../../../store/AlertContext";

export function AddItemDetail({ invoiceCode, cart, setCart, onClose }) {
  const [products, setProducts] = useState([]);
  const [rightBar] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [categoryItem, setCategoryItem] = useState([]);

  const { showAlert } = useAlert();

  /** Fetch Products */
  const fetchProduct = useCallback(async () => {
    try {
      const res = await api.get("/master/products");
      setProducts(res?.data?.data || []);
    } catch {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchProduct();
    ["product:created", "product:updated", "product:deleted"].forEach((event) =>
      listenToUpdate(event, fetchProduct)
    );
  }, [fetchProduct]);

  /** Fetch Categories */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/master/categories");
        setCategoryItem(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const categories = ["All", ...categoryItem.map((cat) => cat.categoryName)];

  const safeNumber = (v) => (Number.isNaN(Number(v)) ? 0 : Number(v));

  /** Total addons */
  const addonsTotal = (addons) =>
    (addons || []).reduce((sum, a) => sum + safeNumber(a.price), 0);

  /** Unique cart key */
  const computeCartItemId = (item) => {
    const note = (item.note || "").replace(/\s+/g, "_");
    const variantKey = item.variant?.variantId || "no-variant";
    const addonKey =
      item.selectedAddons.length > 0
        ? item.selectedAddons.map((a) => a.addonId).join("-")
        : "no-addon";

    return `${item.productId}-${variantKey}-${addonKey}-${note}`;
  };

  /** Filter menu */
  const filteredMenu = products.filter(
    (item) =>
      (activeCategory === "All" || item.categoryName === activeCategory) &&
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /** Open detail item */
  const handleProductDetail = (item) => {
    setSelectedItem({
      ...item,
      qty: 1,
      variant: null,
      variantExtraPrice: 0,
      variants: item.variants || [],
      note: "",
      selectedAddons: [],
    });
  };

  /** Update Qty */
  const updateQty = (delta) =>
    setSelectedItem((prev) => ({
      ...prev,
      qty: Math.max(1, prev.qty + delta),
    }));

  /** Final total */
  const selectedFinalPrice = useMemo(() => {
    if (!selectedItem) return 0;
    const base = safeNumber(selectedItem.price);
    const addon = addonsTotal(selectedItem.selectedAddons);
    const variantExtra = safeNumber(selectedItem.variantExtraPrice);
    return (base + addon + variantExtra) * selectedItem.qty;
  }, [selectedItem]);

  /** Add to Cart */
  const addToCart = (item) => {
    if (!item) return;

    const base = safeNumber(item.price);
    const addonTotal = addonsTotal(item.selectedAddons);
    const variantExtra = safeNumber(item.variantExtraPrice);
    const qty = Math.max(1, item.qty);
    const totalPrice = (base + addonTotal + variantExtra) * qty;

    const cartItem = {
      transactionItemId: cart.id,
      cartItemId: computeCartItemId(item),

      productId: item.productId,
      productName: item.productName,

      qty,
      basePrice: base,

      variant: item.variant,
      variantExtraPrice: variantExtra,

      addons: item.selectedAddons,

      note: item.note,
      categoryName: item.categoryName,
      totalPrice,
    };
    console.log(cart);
    setCart(cartItem);
    showAlert("success", "Item added to cart!");
    setSelectedItem(null);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/40  z-50 flex justify-end">
      <div className="w-full overflow-y-auto md:w-[600px] h-full bg-gray-800 text-gray-200 flex flex-col animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Add Menu Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="p-5 flex flex-col gap-3">
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

          {/* Category */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm rounded-full ${
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

        {/* Product List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-5 overflow-y-auto">
          {filteredMenu.map((item) => (
            <motion.button
              key={item.productId}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleProductDetail(item)}
              className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl shadow text-left"
            >
              <h3 className="font-semibold uppercase">{item.productName}</h3>
              <p className="text-xs text-gray-400">{item.categoryName}</p>
              <p className="font-bold text-blue-400 mt-1">
                Rp {safeNumber(item.price).toLocaleString()}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedItem && (
          <div className="p-5 border-t border-gray-700 mt-auto bg-gray-900">
            <h2 className="text-xl font-bold">{selectedItem.productName}</h2>
            <p className="text-sm text-gray-400">{selectedItem.categoryName}</p>

            <p className="text-lg font-semibold text-blue-400 mb-4">
              Rp {safeNumber(selectedItem.price).toLocaleString()}
            </p>

            {/* Qty */}
            <div className="mb-4">
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
            {selectedItem.variants?.length > 0 && (
              <div className="mb-4">
                <label className="text-sm mb-2 block">Pilih Variant</label>
                {selectedItem.variants.map((v) => (
                  <label
                    key={v.variantId}
                    className="flex items-center gap-3 bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-600 mb-2"
                  >
                    <input
                      type="radio"
                      name="variant"
                      checked={selectedItem.variant?.variantId === v.variantId}
                      onChange={() =>
                        setSelectedItem((p) => ({
                          ...p,
                          variant: v,
                          variantExtraPrice: safeNumber(v.extraPrice),
                        }))
                      }
                    />
                    <span>
                      {v.variantValue}{" "}
                      {v.extraPrice > 0 &&
                        `(+Rp ${v.extraPrice.toLocaleString()})`}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Addons */}
            {selectedItem.addons?.length > 0 && (
              <div className="mb-4">
                <label className="text-sm mb-2 block">Add-on</label>
                {selectedItem.addons.map((addon) => {
                  const isChecked = selectedItem.selectedAddons.some(
                    (a) => a.addonId === addon.addonId
                  );
                  return (
                    <label
                      key={addon.addonId}
                      className="flex items-center gap-3 bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-600 mb-2"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setSelectedItem((prev) => {
                            const selected = prev.selectedAddons;
                            return {
                              ...prev,
                              selectedAddons: isChecked
                                ? selected.filter(
                                    (a) => a.addonId !== addon.addonId
                                  )
                                : [...selected, addon],
                            };
                          })
                        }
                      />
                      <span>
                        {addon.addonName} + Rp{" "}
                        {safeNumber(addon.price).toLocaleString()}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Note */}
            <div className="mb-4">
              <label className="text-sm mb-2 block">Catatan</label>
              <textarea
                placeholder="Tanpa gula, extra es..."
                value={selectedItem.note}
                onChange={(e) =>
                  setSelectedItem((p) => ({ ...p, note: e.target.value }))
                }
                className="w-full p-3 bg-gray-700 rounded-lg"
                rows={3}
              />
            </div>

            {/* Total */}
            <div className="flex justify-between font-semibold mb-3">
              <span>Total</span>
              <span className="text-blue-400 text-lg">
                Rp {selectedFinalPrice.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => addToCart(selectedItem)}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 mt-4 rounded-lg font-semibold text-white"
            >
              Tambahkan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
