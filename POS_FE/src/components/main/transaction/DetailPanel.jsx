/* eslint-disable no-unused-vars */
import dayjs from "dayjs";
import { FaUser, FaList, FaMoneyBillWave, FaArrowLeft } from "react-icons/fa";

export default function DetailPanel({ open, order, items, onClose }) {
  return (
    <div
      className={`transition-all duration-300 
        ${
          open
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-10 pointer-events-none"
        }
        bg-gray-800/70 border border-gray-700 shadow-xl rounded-xl 
        p-5 h-[calc(100vh-120px)] sticky top-24 overflow-y-auto`}
    >
      {!order ? (
        <div className="text-gray-400 text-center py-10 italic">
          Select order to view details
        </div>
      ) : (
        <div className="space-y-4 text-gray-200">
          {/* TITLE + CLOSE BUTTON */}
          <div className="flex  gap-2 items-center">
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            >
              <FaArrowLeft />
            </button>
            <h2 className="text-xl font-bold">Order Detail</h2>
            {/* STATUS */}
            <StatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* INFO */}
            <section className="bg-gray-900/60 p-4 rounded-xl border border-gray-700 space-y-3">
              <InfoRow
                icon={<FaList />}
                label="Invoice"
                value={order.invoiceCode}
              />
              <InfoRow
                icon={<FaUser />}
                label="Customer"
                value={order.customerName}
              />
              <InfoRow
                icon={<FaMoneyBillWave />}
                label="Payment"
                value={order.paymentType?.toUpperCase()}
              />
              <InfoRow
                label="Created At"
                value={dayjs(order.createdAt).format("DD MMM YYYY HH:mm")}
              />
            </section>

            {/* SUMMARY */}
            <section className="bg-gray-900/60 p-4 rounded-xl border border-gray-700 space-y-2">
              <h3 className="text-lg font-semibold mb-2">Summary</h3>

              <SummaryRow label="Subtotal" value={order.subTotal} />
              <SummaryRow
                label="Discount"
                value={order.totalAmount * (order.discount / 100)}
              />

              <hr className="border-gray-700" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-400">
                  Rp {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </section>
          </div>

          {/* ITEMS */}
          <section className="bg-gray-900/60 p-4 rounded-xl border border-gray-700 space-y-4">
            <h3 className="text-lg font-semibold">Items</h3>

            {items?.length > 0 ? (
              items.map((item) => <ItemCard key={item.id} item={item} />)
            ) : (
              <p className="text-gray-500 text-sm italic">No items</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

/* ===== COMPONENTS ===== */

function StatusBadge({ status }) {
  const style =
    status === "pending"
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
      : status === "paid"
      ? "bg-green-500/20 text-green-400 border-green-500/40"
      : "bg-red-500/20 text-red-400 border-red-500/40";

  return (
    <div className={`px-4 py-2 text-sm rounded-lg border w-fit ${style}`}>
      {status.toUpperCase()}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex justify-between items-center">
      <p className="flex items-center gap-2 text-gray-300">
        {icon} {label}
      </p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm text-gray-300">
      <span>{label}</span>
      <span>Rp {Number(value).toLocaleString()}</span>
    </div>
  );
}

function ItemCard({ item }) {
  return (
    <div className="border border-gray-700 rounded-lg p-3 bg-gray-800/40 hover:bg-gray-800/60 transition">
      <div className="flex justify-between">
        <div>
          <h4 className="font-semibold text-gray-100">{item.productName}</h4>
          <p className="text-sm text-gray-400">
            Qty {item.quantity} × Rp {Number(item.subtotal).toLocaleString()}
          </p>
        </div>
        <p className="text-green-400 font-bold">
          Rp {Number(item.subtotal).toLocaleString()}
        </p>
      </div>

      {item.variants?.length > 0 && (
        <div className="mt-2 text-sm text-gray-400">
          <p className="font-medium text-gray-300">Variants:</p>
          {item.variants.map((v) => (
            <li key={v.id}>
              {v.variantName} — Rp {v.variantPrice.toLocaleString()}
            </li>
          ))}
        </div>
      )}

      {item.addons?.length > 0 && (
        <div className="mt-2 text-sm text-gray-400">
          <p className="font-medium text-gray-300">Add-ons:</p>
          {item.addons.map((a) => (
            <li key={a.id}>
              {a.addonName} (x{a.quantity}) — Rp {a.addonPrice.toLocaleString()}
            </li>
          ))}
        </div>
      )}

      {item.note && (
        <p className="text-xs text-gray-500 italic mt-1">Note: {item.note}</p>
      )}
    </div>
  );
}
