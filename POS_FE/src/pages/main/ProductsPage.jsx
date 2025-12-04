/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { Table } from "../../shared/Table";
import { listenToUpdate } from "../../services/socket.service";
import api from "../../services/axios.service";
import Modal from "../../shared/Modal";
import FormProduct from "../../components/main/products/FormProduct";
import dayjs from "dayjs";
import ConfirmDelete from "../../shared/ConfirmDeleted";
import { useAlert } from "../../store/AlertContext";

export function ProductPage() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("nameAsc");
  const [products, setProducts] = useState([]);
  const [categories, setCategory] = useState();
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("Add");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Confirm Delete State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { showAlert } = useAlert();

  const fetchProduct = useCallback(async () => {
    try {
      let res = await api.get("/master/products");
      setProducts(res?.data?.data || []);
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      let res = await api.get(`/master/categories`);
      setCategory(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProduct();
    ["product:created", "product:updated", "product:deleted"].forEach((event) =>
      listenToUpdate(event, fetchProduct)
    );
  }, [fetchProduct]);

  const openAddModal = () => {
    setFormMode("Add");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormMode("Edit");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // ⬇️ Buka confirm modal
  const handleDelete = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  // ⬇️ Eksekusi delete setelah konfirmasi
  const confirmDelete = async () => {
    try {
      await api.delete(`/master/products/${deleteId}`);
      showAlert("success", "Deleted Product Successfully!");
      setIsConfirmOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const columns = [
    { header: "Name", key: "productName" },
    { header: "Category", key: "categoryName" },
    {
      header: "Price",
      key: "price",
      render: (value) => `Rp ${Number(value).toLocaleString()}`,
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
    {
      header: "Created At",
      key: "createdAt",
      render: (val) => dayjs(val).format("DD MMM YY HH:mm:ss"),
    },
  ];

  const filteredProducts = (products || [])
    .filter((item) =>
      item?.productName?.toLowerCase().includes(search.toLowerCase())
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
        onClick={() => openEditModal(row)}
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
    <div className="p-6 bg-gray-900 rounded-4xl text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-gray-100 font-bold">Product Management</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
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

        <select
          className="bg-white border px-3 py-2 rounded shadow-sm"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value={"All"}>All</option>
          {categories?.map((category) => (
            <option key={category.categoryId} value={category.categoryName}>
              {category.categoryName}
            </option>
          ))}
        </select>

        <select
          className="bg-white border px-3 py-2 rounded shadow-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

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

      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No products found.
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredProducts}
          actionRenderer={actionRenderer}
        />
      )}

      {/* 📝 Modal Form */}
      <Modal
        isOpen={isModalOpen}
        title={`${formMode} Product`}
        onClose={() => setIsModalOpen(false)}
      >
        <FormProduct
          mode={formMode}
          initialData={selectedProduct}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* 🗑 Confirm Delete */}
      <ConfirmDelete
        isOpen={isConfirmOpen}
        title="Hapus Produk?"
        message="Produk yang dihapus tidak bisa dikembalikan."
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
