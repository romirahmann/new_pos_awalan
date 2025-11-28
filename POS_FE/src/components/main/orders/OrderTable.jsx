/* eslint-disable no-unused-vars */
import dayjs from "dayjs";
import { Table } from "../../../shared/Table";

export function OrderTable({ data = [] }) {
  const columns = [
    { key: "invoiceCode", header: "Invoice Code" },
    { key: "customerName", header: "Customer Name" },
    {
      key: "totalAmount",
      header: "Total",
      render: (value) => (
        <span className="text-green-400">Rp {value.toLocaleString()}</span>
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

  const actionRenderer = (row) => (
    <div className="flex gap-2">
      <button className="text-blue-400 hover:text-blue-300">View</button>
      <button className="text-red-400 hover:text-red-300">Delete</button>
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
    </div>
  );
}
