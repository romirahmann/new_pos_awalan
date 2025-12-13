/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState, useMemo } from "react";
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
import Modal from "../../../shared/Modal";
import { useAlert } from "../../../store/AlertContext";
import { listenToUpdate } from "../../../services/socket.service";
import { AddItemDetail } from "./AddItemDetail";
import { PiPackageBold } from "react-icons/pi";

export function OrderDetail() {
  const { invoiceCode } = useParams([]);
  const router = useRouter();
  const [modal, setModal] = useState({ isOpen: false, type: "" });
  const [transaction, setTransaction] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  const { showAlert } = useAlert();

  const fetchDetail = useCallback(async () => {
    try {
      const res = await api.get(`/master/transactions/invoice/${invoiceCode}`);

      const data = res.data.data;
      setTransaction(data.trx);
      setItems(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [invoiceCode]);

  useEffect(() => {
    [
      "transaction:created",
      "transaction:updated",
      "transaction:deleted",
      "transaction_item:created",
      "transaction_item:updated",
      "transaction_item:deleted",
    ].forEach((event) => listenToUpdate(event, fetchDetail));
  }, [fetchDetail]);

  useEffect(() => {
    fetchDetail();
  }, [invoiceCode]);

  const updateStatus = async (type) => {
    try {
      const status = type === "PAID" ? "paid" : "canceled";
      await api.put(`/master/paid-trx/${transaction.transactionId}`, {
        status,
      });

      showAlert("success", `Transaction ${type} Successfully!`);
      fetchDetail();
    } catch (err) {
      console.error(err);
      showAlert("error", `Failed to ${type} Transaction`);
    } finally {
      setModal({ isOpen: false, type: "" });
    }
  };

  const handleEditItem = (item) => {
    router.navigate({
      to: "/orders/item-edit/$id",
      params: { id: item.id },
    });
  };

  const handleDeleteItem = async (item) => {
    try {
      await api.delete(`/master/transaction-items/${item.id}`);
      showAlert("success", "Deleted item successfully!");
      fetchDetail();
    } catch (err) {
      console.error(err);
      showAlert("error", "Deleted Item Failed");
    }
  };
  const handleAddItem = async (val) => {
    try {
      await api.post(`/master/transactions/${invoiceCode}/items`, {
        ...val,
        invoiceCode,
      });
      showAlert("success", "Add Item Successfully!");
    } catch (error) {
      console.log(error);
      showAlert("error", "Add Item Failed!");
    }
  };
  if (loading)
    return (
      <div className="p-8 text-center text-gray-400 text-lg bg-gray-900 min-h-screen">
        Loading Order Detail...
      </div>
    );
  if (!transaction)
    return (
      <div className="p-8 text-center text-red-400 text-lg bg-gray-900 min-h-screen">
        Data tidak ditemukan.
      </div>
    );

  return (
    <>
      <div className="h-full bg-gray-900 text-gray-200 p-6">
        {/* HEADER */}
        <div className="title flex gap-3 items-center mb-3">
          <h1 className="text-2xl font-bold mt-5">Order Detail</h1>
          <StatusBadge status={transaction.status} />
          {transaction.status === "pending" && (
            <button
              onClick={() => setShowAddItem(true)}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white font-semibold ms-auto mt-2 lg:mt-0"
            >
              ADD ITEM
            </button>
          )}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-90px)]">
          <div className="col-span-2 overflow-y-auto pr-3 space-y-4 pb-24">
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

          <div className="space-y-4 sticky top-20 self-start">
            <TransactionInfo
              transaction={transaction}
              setTransaction={setTransaction}
              fetchDetail={fetchDetail}
              showAlert={showAlert}
            />
            <TransactionSummary transaction={transaction} />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {transaction.status === "pending" && (
          <div className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 p-4 flex justify-between items-center z-50">
            <button
              onClick={() => setModal({ isOpen: true, type: "CANCELED" })}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-semibold"
            >
              Cancel Order
            </button>
            <button
              onClick={() => setModal({ isOpen: true, type: "PAID" })}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold"
            >
              Mark as PAID
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      <Modal isOpen={modal.isOpen} title={`${modal.type} TRANSACTION`}>
        <p className="text-sm mb-6">{`Are you sure for ${modal.type} ?`}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setModal({ isOpen: false, type: "" })}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
          >
            Batal
          </button>
          <button
            onClick={() => updateStatus(modal.type)}
            className={`px-4 py-2 rounded transition text-white ${
              modal.type === "PAID"
                ? "bg-green-600 hover:bg-green-500"
                : "bg-red-600 hover:bg-red-500"
            }`}
          >
            {modal.type === "PAID" ? "Paid" : "Canceled"}
          </button>
        </div>
      </Modal>

      {/* ADD ITEM SIDEBAR */}
      {showAddItem && (
        <AddItemDetail
          invoiceCode={transaction.invoiceCode}
          cart={items}
          setCart={handleAddItem}
          onClose={() => setShowAddItem(false)}
        />
      )}
    </>
  );
}

/* COMPONENTS */

function StatusBadge({ status }) {
  const style =
    status === "pending"
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      : status === "paid"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30";

  return (
    <div
      className={` px-4 py-2 rounded-lg border text-sm font-semibold ${style}`}
    >
      Status: {status.toUpperCase()}
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

function TransactionInfo({
  transaction,
  setTransaction,
  fetchDetail,
  showAlert,
}) {
  const isPending = transaction.status === "pending";
  const handleUpdate = async () => {
    try {
      await api.put(`/master/transactions/${transaction.transactionId}`, {
        customerName: transaction.customerName,
        paymentType: transaction.paymentType,
        orderType: transaction.orderType,
      });
      showAlert("success", "Transaction Info Updated!");
      fetchDetail();
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to update transaction info");
    }
  };

  return (
    <section className="bg-gray-800/60 shadow rounded-xl border border-gray-700 p-5">
      <div className="header flex justify-between items-center">
        <h2 className="text-md md:text-xl font-semibold mb-3">
          Transaction Info
        </h2>
        <div className="btn">
          <button
            onClick={handleUpdate}
            className="ms-auto px-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
          >
            Update Info
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        <CardInfo
          icon={<FaList className="text-blue-400" />}
          title="Invoice"
          value={transaction.invoiceCode}
        />
        {isPending ? (
          <>
            {/* Order Type */}
            <div className=" bg-gray-800/70 border border-gray-700 shadow rounded-xl p-4 mt-3">
              <div className="flex items-center gap-2 font-semibold mb-1 text-gray-300">
                <PiPackageBold className="text-green-400" /> Order Type
              </div>
              <select
                value={transaction.orderType || ""}
                onChange={(e) =>
                  setTransaction((p) => ({ ...p, orderType: e.target.value }))
                }
                className="w-full p-2 rounded-lg bg-gray-700 text-gray-200 outline-none"
              >
                <option value="">Select Payment Type</option>
                <option value="dinein">Dine In</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            {/* Customer */}
            <div className=" bg-gray-800/70 border border-gray-700 shadow rounded-xl p-4 mt-3">
              <div className="flex items-center gap-2 font-semibold mb-1 text-gray-300">
                <FaUser className="text-green-400" /> Customer
              </div>
              <input
                type="text"
                value={transaction.customerName || ""}
                onChange={(e) =>
                  setTransaction((p) => ({
                    ...p,
                    customerName: e.target.value,
                  }))
                }
                className="w-full p-2 rounded-lg bg-gray-700 text-gray-200 outline-none"
                placeholder="Customer Name"
              />
            </div>
            {/* Payment */}
            <div className="bg-gray-800/70 border border-gray-700 shadow rounded-xl p-4 mt-3">
              <div className="flex items-center gap-2 font-semibold mb-1 text-gray-300">
                <FaMoneyBillWave className="text-yellow-400" /> Payment
              </div>
              <select
                value={transaction.paymentType || ""}
                onChange={(e) =>
                  setTransaction((p) => ({ ...p, paymentType: e.target.value }))
                }
                className="w-full p-2 rounded-lg bg-gray-700 text-gray-200 outline-none"
              >
                <option value="">Select Payment Type</option>
                <option value="cash">Cash</option>
                <option value="qris">Qris</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <CardInfo
              icon={<FaUser className="text-green-400" />}
              title="Order Type"
              value={transaction.customerName || "-"}
            />
            <CardInfo
              icon={<FaUser className="text-green-400" />}
              title="Customer"
              value={transaction.customerName || "-"}
            />
            <CardInfo
              icon={<FaMoneyBillWave className="text-yellow-400" />}
              title="Payment"
              value={transaction.paymentType?.toUpperCase()}
            />
          </>
        )}
      </div>
    </section>
  );
}

function TransactionSummary({ transaction }) {
  const subtotal = Number(transaction.subTotal || 0);
  const discount = Number(transaction.discount || 0);
  const totalAmount = Number(transaction.totalAmount || 0);

  return (
    <section className="bg-gray-800/60 shadow rounded-xl border border-gray-700 p-5">
      <h2 className="text-xl font-semibold mb-3">Summary</h2>
      <SummaryRow label="Subtotal" value={subtotal} />
      <SummaryRow label="Discount" value={subtotal * (discount / 100)} />
      <hr className="my-3 border-gray-700" />
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-green-400">
          Rp {totalAmount.toLocaleString()}
        </span>
      </div>
      <p className="text-xs text-gray-500 text-center mt-4">
        Created at: {dayjs(transaction.createdAt).format("DD MMM YYYY HH:mm")}
      </p>
    </section>
  );
}

function CardInfo({ icon, title, value }) {
  return (
    <div className="bg-gray-800/70 border border-gray-700 shadow rounded-xl p-2 px-4 md:p-4 mt-3">
      <div className="text-sm md:text-md flex items-center gap-2 font-semibold mb-1 text-gray-300">
        {icon} {title}
      </div>
      <p className="text-sm md:text-lg font-bold">{value}</p>
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
