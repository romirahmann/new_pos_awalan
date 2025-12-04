/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";

import { Table } from "../../shared/Table";
import { listenToUpdate } from "../../services/socket.service";
import dayjs from "dayjs";
import Modal from "../../shared/Modal";
import { useAlert } from "../../store/AlertContext";
import api from "../../services/axios.service";

export function TransactionPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("dateNewest");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { showAlert } = useAlert();

  const fetchOrders = useCallback(async () => {
    try {
      let res = await api.get("/master/transactions");

      setOrders(res.data.data);
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    fetchOrders();
    ["order:created", "order:updated", "order:deleted"].forEach((e) =>
      listenToUpdate(e, fetchOrders)
    );
  }, [fetchOrders]);

  const openDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const filteredOrders = orders
    .filter((o) => o.invoiceCode.toLowerCase().includes(search.toLowerCase()))
    .filter((o) => (statusFilter === "All" ? true : o.status === statusFilter))
    .sort((a, b) => {
      if (sortBy === "dateNewest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "dateOldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "amountAsc") return a.totalAmount - b.totalAmount;
      if (sortBy === "amountDesc") return b.totalAmount - a.totalAmount;
      return 0;
    });

  const columns = [
    { key: "invoiceCode", header: "Invoice Code" },
    { key: "customerName", header: "Customer Name" },
    {
      key: "totalAmount",
      header: "Total",
      render: (value) => (
        <span className="text-green-400">Rp {value?.toLocaleString() | 0}</span>
      ),
    },
    { key: "paymentType", header: "Payment" },
    { key: "discount", header: "Discount" },
    { key: "tax", header: "Tax" },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 uppercase rounded-full text-xs ${
            value === "paid"
              ? "bg-green-500/20 text-green-400"
              : value === "pending"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (value) => dayjs(value).format("DD-MM-YYYY HH:mm:ss"),
    },
  ];

  const actionRenderer = (row) => (
    <div className="flex gap-2 justify-center">
      <button
        className="p-2 rounded-lg bg-blue-600/20 border border-blue-600/40 text-blue-300 hover:bg-blue-600/40 transition"
        onClick={() => openDetail(row)}
      >
        <FaEye />
      </button>
      <button
        className="p-2 rounded-lg bg-green-600/20 border border-green-600/40 text-blue-300 hover:bg-blue-600/40 transition"
        onClick={() => openDetail(row)}
      >
        <FaEdit />
      </button>
      <button
        className="p-2 rounded-lg bg-red-600/20 border border-red-600/40 text-blue-300 hover:bg-blue-600/40 transition"
        onClick={() => openDetail(row)}
      >
        <FaTrash />
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-gray-900 rounded-4xl text-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Order Management</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="flex items-center bg-[#161b22] border border-gray-700 px-3 py-2 rounded-lg">
          <FaSearch className="mr-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-gray-200 outline-none"
          />
        </div>

        <select
          className="bg-[#161b22] border border-gray-700 text-gray-200 px-3 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          className="bg-[#161b22] border border-gray-700 text-gray-200 px-3 py-2 rounded-lg"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="dateNewest">Newest</option>
          <option value="dateOldest">Oldest</option>
          <option value="amountAsc">Total Low-High</option>
          <option value="amountDesc">Total High-Low</option>
        </select>
      </div>

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-400 py-10 italic">
          No orders found.
        </div>
      ) : (
        <div className=" border border-gray-700 rounded-xl p-4 shadow-xl">
          <Table
            columns={columns}
            data={filteredOrders}
            actionRenderer={actionRenderer}
          />
        </div>
      )}

      {/* DETAIL MODAL */}
      <Modal
        isOpen={isDetailOpen}
        title="Detail Order"
        onClose={() => setIsDetailOpen(false)}
      >
        {selectedOrder ? (
          <div className="space-y-3 text-gray-200 p-2">
            <p>
              <b>Invoice:</b> {selectedOrder.invoiceCode}
            </p>
            <p>
              <b>Customer:</b> {selectedOrder.customerName}
            </p>
            <p>
              <b>Total:</b> Rp{" "}
              {Number(selectedOrder.totalAmount).toLocaleString()}
            </p>
            <p>
              <b>Status:</b> {selectedOrder.status}
            </p>
            <p>
              <b>Tanggal:</b>{" "}
              {dayjs(selectedOrder.createdAt).format("DD MMM YYYY HH:mm")}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
