/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaSearch,
  FaRedo,
  FaPrint,
  FaCreditCard,
} from "react-icons/fa";
import { OrderTable } from "./OrderTable";

import { ConfirmNewTransactionModal } from "./ConfirmTransaction";
import api from "../../../services/axios.service";
import { listenToUpdate } from "../../../services/socket.service";
import { useAlert } from "../../../store/AlertContext";
import { useRouter } from "@tanstack/react-router";

export function MainOrder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("date_desc");
  const [orders, setOrders] = useState([]);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    selectedData: [],
  });
  const { showAlert } = useAlert();
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    try {
      let res = await api.get("/master/transactions");
      setOrders(res.data.data);
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    ["transaction:created", "transaction:update", "transaction:delete"].map(
      (val) => listenToUpdate(val, fetchOrders)
    );
  }, [fetchOrders]);

  const filteredOrders = orders
    .filter((order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((order) =>
      searchStatus === "ALL" ? true : order.status === searchStatus
    );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "date_desc")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "date_asc")
      return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "amount_desc") return b.totalAmount - a.totalAmount;
    if (sortBy === "name") return a.customerName.localeCompare(b.customerName);
    return 0;
  });

  const handleAddTransaction = async () => {
    try {
      showAlert("success", "Add Transaction Successfully!");
      setModal({ isOpen: false, type: "", selectedData: [] });
      router.navigate({ to: "order-item" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-gray-200 p-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg shadow-md w-full md:w-1/3">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Cari customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-gray-200"
            />
          </div>

          <div className="filter flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 px-4 py-2 rounded-lg shadow-md text-gray-300"
            >
              <option value="date_desc">Tanggal Terbaru</option>
              <option value="date_asc">Tanggal Terlama</option>
              <option value="amount_desc">Nominal Tertinggi</option>
              <option value="name">Nama Customer</option>
            </select>

            <button
              onClick={() =>
                setModal({ isOpen: true, type: "ADD", selectedData: [] })
              }
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2 text-white rounded-lg shadow-md"
            >
              <FaPlus /> Tambah Order
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {["ALL", "PENDING", "PAID", "CANCELED"].map((status) => (
            <button
              key={status}
              onClick={() => setSearchStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm ${
                searchStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <SummaryCard title="Total Orders" value={orders.length} />
          <SummaryCard
            title="Total Revenue"
            value={`Rp ${orders
              .reduce((a, b) => a + b.totalAmount, 0)
              .toLocaleString()}`}
          />
          <SummaryCard
            title="Pending Orders"
            value={orders.filter((o) => o.status === "PENDING").length}
          />
          <SummaryCard
            title="Paid Orders"
            value={orders.filter((o) => o.status === "PAID").length}
          />
        </div>

        <OrderTable data={sortedOrders} />
      </div>
      <ConfirmNewTransactionModal
        onConfirm={handleAddTransaction}
        isOpen={modal.type === "ADD"}
        onClose={() => setModal({ isOpen: false, type: "", selectedData: [] })}
      />
    </>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-xl font-semibold text-white mt-1">{value}</h2>
    </div>
  );
}
