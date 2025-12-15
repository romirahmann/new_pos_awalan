/* eslint-disable no-unused-vars */
import { useEffect, useMemo } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

/* ============================= */
/* SUMMARY ROW                   */
/* ============================= */
export function SummaryRow({ label, value = 0, bold = false }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold" : ""}`}>
      <span>{label}</span>
      <span>Rp {Number(value).toLocaleString()}</span>
    </div>
  );
}

export function InvoiceSection({ cart, setCart, handlePayment }) {
  useEffect(() => {
    console.log("cart invoice:", cart);
  }, [cart]);

  const safeNumber = (v) => {
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  };

  const updateQty = (cartItemId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity: Math.max(1, item.quantity + delta),
          };
        }
        return item;
      })
    );
  };

  const removeItem = (cartItemId) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + safeNumber(item.basePrice) * item.quantity;
      // return sum + safeNumber(item.totalPrice);
    }, 0);
  }, [cart]);

  const totalDiscount = useMemo(() => {
    return cart.reduce((sum, item) => {
      const basePrice = safeNumber(item.basePrice);
      const discountPercent = safeNumber(item.discountProduct || 0);

      // return sum + safeNumber(item.totalPrice) * (discountPercent / 100);
      return sum + basePrice * (discountPercent / 100) * item.quantity;
    }, 0);
  }, [cart]);

  const grandTotal = subtotal - totalDiscount;

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg flex flex-col overflow-hidden h-full">
      <h2 className="text-xl font-semibold mb-4">Invoice</h2>

      {cart.length === 0 ? (
        <p className="text-gray-400">Keranjang masih kosong...</p>
      ) : (
        <>
          <div className="space-y-3 flex-1 overflow-y-auto custom-scroll pr-1">
            {cart.map((item) => {
              const basePrice = safeNumber(item.basePrice);
              const discountPercent = safeNumber(item.discountProduct || 0);
              const discountNominal = basePrice * (discountPercent / 100);

              return (
                <div
                  key={item.cartItemId}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold">{item.productName}</h4>

                    {item.variant && (
                      <p className="text-xs text-gray-400">
                        Varian: {item.variant}
                      </p>
                    )}

                    {item.selectedAddons?.length > 0 && (
                      <p className="text-xs text-gray-400">
                        Add-ons:{" "}
                        {item.selectedAddons
                          .map(
                            (a) =>
                              `${a.addonName} (+Rp ${safeNumber(
                                a.price
                              ).toLocaleString()})`
                          )
                          .join(", ")}
                      </p>
                    )}

                    {item.note && (
                      <p className="text-xs text-gray-400">Note: {item.note}</p>
                    )}

                    <p className="text-sm text-gray-400">
                      Harga: Rp {basePrice.toLocaleString()}
                    </p>

                    {discountPercent > 0 && (
                      <p className="text-xs text-green-400">
                        Diskon: {discountPercent}% (-Rp{" "}
                        {discountNominal.toLocaleString()})
                      </p>
                    )}
                  </div>

                  {/* QTY */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.cartItemId, -1)}
                      className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
                    >
                      <FaMinus size={12} />
                    </button>

                    <span className="font-bold">{item.quantity}</span>

                    <button
                      onClick={() => updateQty(item.cartItemId, 1)}
                      className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
                    >
                      <FaPlus size={12} />
                    </button>

                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ============================= */}
          {/* SUMMARY                        */}
          {/* ============================= */}
          <div className="mt-6 p-4 bg-gray-700 rounded-lg space-y-2">
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="Diskon" value={totalDiscount} />
            <hr className="border-gray-600" />
            <SummaryRow label="Total" value={grandTotal} bold />
          </div>

          {/* ============================= */}
          {/* PAYMENT BUTTON                */}
          {/* ============================= */}
          <div className="mt-4">
            <button
              onClick={() =>
                handlePayment({
                  subtotal,
                  totalDiscount,
                  grandTotal,
                })
              }
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg"
            >
              Bayar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
