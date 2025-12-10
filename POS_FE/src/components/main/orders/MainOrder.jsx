/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { FaPlus, FaSearch, FaBookmark } from "react-icons/fa";
import { OrderTable } from "./OrderTable";

import { ConfirmNewTransactionModal } from "./ConfirmTransaction";
import api from "../../../services/axios.service";
import { listenToUpdate } from "../../../services/socket.service";
import { useAlert } from "../../../store/AlertContext";
import { useParams, useRouter } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../shared/Modal";

export function MainOrder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [orders, setOrders] = useState([]);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    selectedData: [],
  });
  const { showAlert } = useAlert();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const fetchOrders = useCallback(async () => {
    try {
      let res = await api.get(`/master/transactions?date=day`);
      setOrders(res.data.data);
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    ["transaction:created", "transaction:updated", "transaction:deleted"].map(
      (val) => listenToUpdate(val, fetchOrders)
    );
  }, [fetchOrders]);

  const filteredOrders = orders
    .filter((order) =>
      (order?.customerName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((order) =>
      searchStatus === "all" ? true : (order.status || "") === searchStatus
    );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "date_desc")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "date_asc")
      return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "amount_desc")
      return (b.totalAmount || 0) - (a.totalAmount || 0);
    if (sortBy === "name")
      return (a.customerName || "").localeCompare(b.customerName || "");
    return 0;
  });

  const handleAddTransaction = async () => {
    try {
      let res = await api.post("/master/transaction", { userId: user.userId });

      showAlert("success", "Add Transaction Successfully!");
      setModal({ isOpen: false, type: "", selectedData: [] });
      router.navigate({
        to: "$transactionId/order-item",
        params: { transactionId: res.data.data },
      });
    } catch (error) {
      showAlert("error", "Add Transaction Failed!");
      console.log(error);
    }
  };

  const handleClosing = async () => {
    try {
      console.log(`Handle Close`);
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
              className="flex text-sm lg:text-md items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2 text-white rounded-lg shadow-md"
            >
              <FaPlus /> Add
            </button>
            <button
              onClick={() =>
                setModal({ isOpen: true, type: "CASHBOOK", selectedData: [] })
              }
              className="flex items-center text-sm lg:text-md gap-2 bg-red-600 hover:bg-red-500 px-5 py-2 text-white rounded-lg shadow-md"
            >
              <FaBookmark /> Closing
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {["ALL", "PENDING", "PAID", "CANCELED"].map((status) => (
            <button
              key={status}
              onClick={() => setSearchStatus(status.toLocaleLowerCase())}
              className={`px-4 py-2 rounded-lg text-sm ${
                searchStatus === status.toLocaleLowerCase()
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
              .filter((o) => o.status === "paid")
              .reduce((a, b) => a + Number(b.totalAmount), 0)
              .toLocaleString("id-ID")}`}
          />
          <SummaryCard
            title="Pending Orders"
            value={orders.filter((o) => o.status === "pending").length}
          />
          <SummaryCard
            title="Paid Orders"
            value={orders.filter((o) => o.status === "paid").length}
          />
        </div>

        <OrderTable data={sortedOrders} />
      </div>
      <ConfirmNewTransactionModal
        onConfirm={handleAddTransaction}
        isOpen={modal.type === "ADD"}
        onClose={() => setModal({ isOpen: false, type: "", selectedData: [] })}
      />
      <Modal isOpen={modal.type === "CASHBOOK"} title={`ADD CASHBOOK`}>
        <h1>Closing for all order now?</h1>
        <button
          onClick={() => handleClosing()}
          className="flex mt-5 items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2 text-white rounded-lg shadow-md"
        >
          <FaPlus /> Tambah Cashbook
        </button>
      </Modal>
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
