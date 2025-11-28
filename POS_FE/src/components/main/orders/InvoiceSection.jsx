import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { SummaryRow } from "./SummaryRow";

export function InvoiceSection({ cart, setCart, setModal }) {
  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, qty: Math.max(1, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.11;
  const discount = subtotal > 100000 ? 10000 : 0;
  const grandTotal = subtotal + tax - discount;

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg flex flex-col overflow-hidden">
      <h2 className="text-xl font-semibold mb-4">Invoice</h2>

      {cart.length === 0 ? (
        <p className="text-gray-400">Keranjang masih kosong...</p>
      ) : (
        <>
          <div className="space-y-3 flex-1 overflow-y-auto custom-scroll pr-1">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
              >
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-400">
                    Rp {item.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.productId, -1)}
                    className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="font-bold">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.productId, 1)}
                    className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
                  >
                    <FaPlus size={12} />
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-700 rounded-lg space-y-2">
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="PPN (11%)" value={tax} />
            <SummaryRow label="Diskon" value={discount} />
            <hr className="border-gray-600" />
            <SummaryRow label="Total" value={grandTotal} bold />
          </div>

          <div className="mt-4 flex gap-3">
            <button className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg">
              Simpan Order
            </button>
            <button
              onClick={() => setModal(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg"
            >
              Bayar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
