/* eslint-disable no-unused-vars */
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

export function MenuSection({ cart, setCart }) {
  const menuItems = [
    {
      id: 1,
      productId: "P001",
      name: "Espresso",
      category: "Coffee",
      price: 25000,
    },
    {
      id: 2,
      productId: "P002",
      name: "Cappuccino",
      category: "Coffee",
      price: 30000,
    },
    {
      id: 3,
      productId: "P003",
      name: "Latte",
      category: "Coffee",
      price: 32000,
    },
    {
      id: 4,
      productId: "P004",
      name: "Chocolate Ice",
      category: "Non-Coffee",
      price: 28000,
    },
    {
      id: 5,
      productId: "P005",
      name: "Croissant",
      category: "Snack",
      price: 18000,
    },
    {
      id: 6,
      productId: "P006",
      name: "French Fries",
      category: "Snack",
      price: 22000,
    },
    {
      id: 7,
      productId: "P007",
      name: "Nasi Goreng",
      category: "Food",
      price: 35000,
    },
  ];

  const categories = ["All", "Coffee", "Non-Coffee", "Snack", "Food"];

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredMenu = menuItems.filter(
    (item) =>
      (activeCategory === "All" || item.category === activeCategory) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.productId === item.productId);
      return exists
        ? prev.map((c) =>
            c.productId === item.productId ? { ...c, qty: c.qty + 1 } : c
          )
        : [...prev, { ...item, qty: 1 }];
    });
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
      <div className="grid grid-cols-3 gap-3 ">
        {filteredMenu.map((item) => (
          <motion.button
            key={item.productId}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => addToCart(item)}
            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl shadow text-left transition"
          >
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-xs text-gray-400">{item.category}</p>
            <p className="font-bold text-blue-400 mt-1">
              Rp {item.price.toLocaleString()}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
