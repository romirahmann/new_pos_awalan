/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import dayjs from "dayjs";
import Modal from "../../shared/Modal";
import { Table } from "../../shared/Table";
import api from "../../services/axios.service";
import { listenToUpdate } from "../../services/socket.service";
import { FormCashbook } from "../../components/main/cashbook/formCashbook";

// ==========================
// FORMATTER RUPIAH INDONESIA
// ==========================
const formatIDR = (num) => {
  if (!num && num !== 0) return "0";
  return num.toLocaleString("id-ID");
};

export function CashbookPage() {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState({
    isOpen: false,
    type: "Add",
  });

  const [cashbookData, setCashBook] = useState([]);
  const [selectedItem, setSelected] = useState(null);

  const fetchCashbook = useCallback(async () => {
    try {
      let res = await api.get("/master/cashbooks");
      //   console.log(res.data.data);
      setCashBook(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchCashbook();

    ["cashbook:created", "cashbook:updated", "cashbook:deleted"].forEach((e) =>
      listenToUpdate(e, fetchCashbook)
    );
  }, [fetchCashbook]);

  const filtered = cashbookData.filter((r) =>
    r.notes.toLowerCase().includes(search.toLowerCase())
  );

  // Summary dari filter
  const sumIn = filtered.reduce((acc, v) => acc + v.total_in, 0);
  const sumOut = filtered.reduce((acc, v) => acc + v.total_out, 0);
  const sumBalance = filtered.reduce((acc, v) => acc + v.net_balance, 0);

  // Columns Table
  const columns = [
    {
      key: "recordDate",
      header: "Date",
      render: (value) => dayjs(value).format("DD-MM-YYYY"),
    },
    {
      key: "total_in",
      header: "Total Income",
      render: (value) => (
        <span className="text-green-400">Rp {formatIDR(value)}</span>
      ),
    },
    {
      key: "total_out",
      header: "Total Expense",
      render: (value) => (
        <span className="text-red-400">Rp {formatIDR(value)}</span>
      ),
    },
    {
      key: "net_balance",
      header: "Net Balance",
      render: (value) => (
        <span className="text-blue-400">Rp {formatIDR(value)}</span>
      ),
    },
    { key: "notes", header: "Notes" },
    { key: "createdByName", header: "Created By" },
  ];

  return (
    <div className="p-6 bg-gray-900 rounded-4xl min-h-screen text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cashbook</h1>
        <button
          className="bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
          onClick={() => setIsModalOpen({ isOpen: true, type: "Add" })}
        >
          <FaPlus /> Add Daily Record
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-[#161b22] border border-gray-700 px-3 py-2 rounded-lg">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-gray-200 outline-none"
          />
        </div>

        <div className="flex items-center bg-[#161b22] border border-gray-700 px-3 py-2 rounded-lg w-64">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-gray-200 outline-none w-full"
          />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-[#161b22] border border-gray-700 rounded-lg">
          <p className="text-gray-400 mb-1">Total Income</p>
          <h2 className="text-2xl text-green-400 font-bold">
            Rp {formatIDR(sumIn)}
          </h2>
        </div>

        <div className="p-4 bg-[#161b22] border border-gray-700 rounded-lg">
          <p className="text-gray-400 mb-1">Total Expense</p>
          <h2 className="text-2xl text-red-400 font-bold">
            Rp {formatIDR(sumOut)}
          </h2>
        </div>

        <div className="p-4 bg-[#161b22] border border-gray-700 rounded-lg">
          <p className="text-gray-400 mb-1">Net Balance</p>
          <h2 className="text-2xl text-blue-400 font-bold">
            Rp {formatIDR(sumBalance)}
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="border border-gray-700 rounded-xl p-4">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-10 italic">
            No records found.
          </div>
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </div>

      {/* ADD DAILY RECORD MODAL */}
      <Modal
        isOpen={isModalOpen.isOpen}
        title={`${isModalOpen.type} Cashbook Daily Record`}
        onClose={() => setIsModalOpen({ isOpen: false, type: "" })}
      >
        <FormCashbook
          mode={isModalOpen.type}
          initialData={selectedItem}
          onClose={() => setIsModalOpen({ isOpen: false, type: "" })}
        />
      </Modal>
    </div>
  );
}
