/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaUser,
  FaList,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import dayjs from "dayjs";
import { useParams, useRouter } from "@tanstack/react-router";
import api from "../../../services/axios.service";

export function OrderDetail() {
  const { invoiceCode } = useParams([]);
  const router = useRouter();

  const [transaction, setTransaction] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/master/transactions/invoice/${invoiceCode}`);
      let data = res.data.data;
      // console.log(data);
      setTransaction(data.trx);
      setItems(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!confirm(`Ubah status menjadi ${newStatus}?`)) return;

    try {
      await api.put(`/master/transactions/status/${invoiceCode}`, {
        status: newStatus,
      });
      fetchDetail();
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status");
    }
  };

  const handleEditItem = (item) => {
    router.navigate({
      to: "/orders/item-edit/$id",
      params: { id: item.id },
    });
  };

  const handleDeleteItem = async (item) => {
    if (!confirm("Yakin hapus item ini?")) return;

    try {
      await api.delete(`/master/transactions/items/${item.id}`);
      fetchDetail();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus item");
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [invoiceCode]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400 text-lg bg-gray-900 min-h-screen">
        Loading Order Detail...
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-8 text-center text-red-400 text-lg bg-gray-900 min-h-screen">
        Data tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 text-gray-200 p-6">
      <div className="title flex gap-3 items-center mb-3">
        <h1 className="text-2xl font-bold ">Order Detail</h1>
        {/* STATUS */}
        <StatusBadge status={transaction.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-90px)]">
        {/* LEFT (ITEM LIST) */}
        <div className="col-span-2 overflow-y-auto pr-3 space-y-4 pb-24">
          {/* ITEMS */}
          <section className="bg-gray-800/60 shadow rounded-xl border border-gray-700 p-5 mt-2">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT (INFO + SUMMARY PANEL) */}
        <div className="col-span-1 sticky top-20 self-start space-y-4">
          {/* TRANSACTION BASIC INFO */}
          <section className="bg-gray-800/60 shadow rounded-xl border border-gray-700 p-5">
            <h2 className="text-xl font-semibold mb-3">Transaction Info</h2>

            <div className="grid grid-cols-1 gap-4">
              <CardInfo
                icon={<FaList className="text-blue-400" />}
                title="Invoice"
                value={transaction.invoiceCode}
              />

              <CardInfo
                icon={<FaUser className="text-green-400" />}
                title="Customer"
                value={transaction.customerName || "-"}
              />

              <CardInfo
                icon={<FaMoneyBillWave className="text-yellow-400" />}
                title="Payment"
                value={transaction.paymentType}
              />
            </div>
          </section>

          {/* SUMMARY */}
          <section className="bg-gray-800/60 shadow rounded-xl border border-gray-700 p-5">
            <h2 className="text-xl font-semibold mb-3">Summary</h2>

            <SummaryRow label="Subtotal" value={transaction.subTotal} />
            <SummaryRow label="Discount" value={-transaction.discount} />
            <SummaryRow label="Tax" value={transaction.tax} />

            <hr className="my-3 border-gray-700" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-green-400">
                Rp {Number(transaction.totalAmount).toLocaleString()}
              </span>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Created at:{" "}
              {dayjs(transaction.createdAt).format("DD MMM YYYY HH:mm")}
            </p>
          </section>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      {transaction.status === "pending" && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 p-4 flex justify-between items-center z-50">
          <button
            onClick={() => updateStatus("CANCELED")}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-semibold"
          >
            Cancel Order
          </button>

          <button
            onClick={() => updateStatus("PAID")}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold"
          >
            Mark as PAID
          </button>
        </div>
      )}
    </div>
  );
}

/* ===================================================== */
/* COMPONENTS */
/* ===================================================== */

function StatusBadge({ status }) {
  const style =
    status === "pending"
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      : status === "paid"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30";

  return (
    <div
      className={`w-fit px-4 py-2 rounded-lg border text-sm font-semibold ${style}`}
    >
      Status: {status.toUpperCase()}
    </div>
  );
}

function CardInfo({ icon, title, value }) {
  return (
    <div className="bg-gray-800/70 border border-gray-700 shadow rounded-xl p-4">
      <div className="flex items-center gap-2 font-semibold mb-1 text-gray-300">
        {icon} {title}
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-1 text-gray-300">
      <span>{label}</span>
      <span>Rp {Number(value).toLocaleString()}</span>
    </div>
  );
}

function ItemCard({ item, onEdit, onDelete }) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/40 hover:bg-gray-800/60 transition">
      <div className="flex justify-between items-start pb-2">
        <div>
          <h3 className="font-semibold text-lg text-gray-100">
            {item.productName}
          </h3>
          <p className="text-sm text-gray-400">
            Qty: {item.quantity} × Rp {Number(item.basePrice).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-full"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-2 bg-red-600/30 hover:bg-red-600/50 rounded-full"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {item.variants?.length > 0 && (
        <div className="mt-2 ml-3">
          <p className="font-medium text-sm text-gray-300">Variants:</p>
          <ul className="text-sm ml-4 list-disc text-gray-400">
            {item.variants.map((v) => (
              <li key={v.id}>
                {v.variantName} — Rp {Number(v.variantPrice).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {item.addons?.length > 0 && (
        <div className="mt-2 ml-3">
          <p className="font-medium text-sm text-gray-300">Add-ons:</p>
          <ul className="text-sm ml-4 list-disc text-gray-400">
            {item.addons.map((a) => (
              <li key={a.id}>
                {a.addonName} (x{a.quantity}) — Rp{" "}
                {Number(a.addonPrice).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {item.note && (
        <p className="mt-2 text-sm text-gray-500 italic">Note: {item.note}</p>
      )}
    </div>
  );
}
