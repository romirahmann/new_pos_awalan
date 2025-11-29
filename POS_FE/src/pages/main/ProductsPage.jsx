/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSearch, FaFilter } from "react-icons/fa";
import { Table } from "../../shared/Table";

export function ProductPage() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("nameAsc");

  const [products, setProducts] = useState([
    {
      productId: "P001",
      categoryName: "Coffee",
      productName: "Espresso",
      price: 25000,
      cost: 12000,
      createdAt: "2025-01-15",
      isActive: true,
      img: "https://via.placeholder.com/60",
      productDesc: "Kopi murni tanpa campuran",
    },
    {
      productId: "P002",
      categoryName: "Coffee",
      productName: "Latte",
      price: 32000,
      cost: 15000,
      createdAt: "2025-01-10",
      isActive: false,
      img: "https://via.placeholder.com/60",
      productDesc: "Kopi susu creamy",
    },
    {
      productId: "P003",
      categoryName: "Tea",
      productName: "Green Tea",
      price: 20000,
      cost: 8000,
      createdAt: "2025-01-08",
      isActive: true,
      img: "https://via.placeholder.com/60",
      productDesc: "Teh hijau sehat",
    },
  ]);

  const handleDelete = (id) => {
    if (confirm("Yakin ingin hapus produk ini?")) {
      setProducts((prev) => prev.filter((item) => item.productId !== id));
    }
  };

  const columns = [
    { header: "Name", key: "productName" },
    { header: "Category", key: "categoryName" },
    {
      header: "Price",
      key: "price",
      render: (value) => `Rp ${value.toLocaleString()}`,
    },
    {
      header: "Active",
      key: "isActive",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    { header: "Created At", key: "createdAt" },
  ];

  // Filter + Sorting Logic
  const filteredProducts = products
    .filter((item) =>
      item.productName.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) =>
      filterCategory === "All" ? true : item.categoryName === filterCategory
    )
    .filter((item) =>
      filterStatus === "All"
        ? true
        : filterStatus === "Active"
        ? item.isActive
        : !item.isActive
    )
    .sort((a, b) => {
      if (sortBy === "nameAsc")
        return a.productName.localeCompare(b.productName);
      if (sortBy === "nameDesc")
        return b.productName.localeCompare(a.productName);
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "dateNewest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "dateOldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  const actionRenderer = (row) => (
    <div className="flex gap-2 justify-center">
      <button
        className="p-2 bg-blue-500 rounded hover:bg-blue-600 text-white"
        onClick={() => alert("Edit " + row.productId)}
      >
        <FaEdit />
      </button>
      <button
        className="p-2 bg-red-500 rounded hover:bg-red-600 text-white"
        onClick={() => handleDelete(row.productId)}
      >
        <FaTrash />
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-gray-900 rounded-4xl  text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-gray-100 font-bold">Product Management</h1>
        <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700">
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
        {/* Search */}
        <div className="flex items-center bg-white border px-3 py-2 rounded shadow-sm">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search product..."
            className="w-full bg-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <select
          className="bg-white border px-3 py-2 rounded shadow-sm"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option>All</option>
          <option>Coffee</option>
          <option>Tea</option>
        </select>

        {/* Status Filter */}
        <select
          className="bg-white border px-3 py-2 rounded shadow-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        {/* Sorting */}
        <select
          className="bg-white border px-3 py-2 rounded shadow-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="nameAsc">Name A-Z</option>
          <option value="nameDesc">Name Z-A</option>
          <option value="priceAsc">Price Low-High</option>
          <option value="priceDesc">Price High-Low</option>
          <option value="dateNewest">Newest</option>
          <option value="dateOldest">Oldest</option>
        </select>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredProducts}
        actionRenderer={actionRenderer}
      />
    </div>
  );
}
