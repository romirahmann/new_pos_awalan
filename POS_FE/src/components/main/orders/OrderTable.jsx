/* eslint-disable no-unused-vars */
import dayjs from "dayjs";
import { Table } from "../../../shared/Table";
import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import api from "../../../services/axios.service";
import ConfirmDelete from "../../../shared/ConfirmDeleted";
import { useAlert } from "../../../store/AlertContext";

export function OrderTable({ data = [] }) {
  const router = useRouter();
  const [modal, setModal] = useState({ isOpen: false, type: "" });
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
          className={`px-3 py-1 rounded-full text-xs ${
            value === "PAID"
              ? "bg-green-500/20 text-green-400"
              : value === "PENDING"
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
  const { showAlert } = useAlert();
  const [transactionId, setTransactionId] = useState(0);

  const handleDelete = async (transactionId) => {
    try {
      await api.delete(`/master/transaction/${transactionId}`);
      showAlert("success", "Deleted Successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = async (row) => {
    try {
      let res = await api.get(`/master/transactions/${row.invoiceCode}/items`);
      if (!res) {
        router.navigate({
          to: "$transactionId/order-item",
          params: { transactionId: row.transactionId },
        });
        return;
      }

      router.navigate({
        to: "$invoiceCode/order-detail",
        params: { invoiceCode: row.invoiceCode },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const actionRenderer = (row) => (
    <div className="flex gap-2">
      <button
        onClick={() => handleView(row)}
        className="text-blue-400 hover:text-blue-300"
      >
        View
      </button>
      <button
        onClick={() => {
          setTransactionId(row.transactionId);
          setModal({ isOpen: true, type: "delete" });
        }}
        className="text-red-400 hover:text-red-300"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="p-4">
      <Table
        columns={columns}
        data={data}
        actionRenderer={actionRenderer}
        rowsPerPage={5}
      />

      <ConfirmDelete
        isOpen={modal.isOpen && modal.type === "delete"}
        title={`Delete Order`}
        onConfirm={() => handleDelete(transactionId)}
        onCancel={() => setModal({ isOpen: false, type: "" })}
      />
    </div>
  );
}
