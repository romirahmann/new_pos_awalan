/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { MenuSection } from "./MenuSection";
import { InvoiceSection } from "./InvoiceSection";
import RightSidebar from "../../../shared/RIghtBar";
import api from "../../../services/axios.service";
import { useParams, useRouter } from "@tanstack/react-router";
import { useAlert } from "../../../store/AlertContext";
import { useSelector } from "react-redux";

export function OrderItemPage() {
  const [modal, setModal] = useState(false);
  const [cart, setCart] = useState([]);

  // FIX: pastikan semua field ada default value
  const [formData, setFormData] = useState({
    customerName: "",
    paymentType: "cash",
    orderType: "dinein",
    notes: "",
    userId: null,
    discount: 0,
    totalAmount: 0,
    subTotal: 0,
  });

  const { userId } = useSelector((state) => state.auth.user);
  const { showAlert } = useAlert();
  const route = useRouter();
  const { transactionId } = useParams([]);

  useEffect(() => {}, []);

  const handlePaymentMethod = (val) => {
    setFormData((prev) => ({
      ...prev,
      discount: val.discount ?? prev.discount,
      totalAmount: val.grandTotal ?? 0,
      subTotal: val.subtotal ?? 0,
      userId: userId || null,
    }));

    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, cart);
    try {
      await api.put(`/master/checkout-transaction/${transactionId}`, {
        cart,
        formData,
      });

      showAlert("success", "Payment Order Successfully!");
      setModal(false);
      // route.navigate({ to: "/orders/main-order" });
    } catch (error) {
      showAlert("error", "Failed to payment!");
      console.log(error);
    }
  };

  const saveOrder = async (e) => {
    e.preventDefault();
    try {
      // console.log(formData);
      await api.put(`/master/save-transaction/${transactionId}`, {
        cart,
        formData,
      });

      showAlert("success", "Save Order Successfully!");
      setModal(false);
      route.navigate({ to: "/orders/main-order" });
    } catch (error) {
      showAlert("error", "Failed to save!");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1.2fr] h-[calc(100vh-90px)] gap-6">
        <MenuSection cart={cart} setCart={setCart} />
        <InvoiceSection
          cart={cart}
          setCart={setCart}
          handlePayment={handlePaymentMethod}
        />
      </div>

      {/* RIGHT SIDEBAR */}
      <RightSidebar isOpen={modal} onClose={() => setModal(false)}>
        <div className="p-5 space-y-4 text-gray-200">
          {/* CUSTOMER NAME */}
          <div>
            <label className="block text-sm mb-1">Customer Name</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              placeholder="Nama pelanggan"
            />
          </div>

          {/* ORDER TYPE */}
          <div>
            <label className="block text-sm mb-2">Order Type</label>
            <div className="grid grid-cols-2 gap-3">
              {["dinein", "takeaway", "delivery"].map((type) => (
                <label
                  key={type}
                  className={`p-4 rounded-lg cursor-pointer border flex flex-col items-center justify-center transition 
                    ${
                      formData.orderType === type
                        ? "bg-blue-600 border-blue-400"
                        : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                    }`}
                >
                  <input
                    type="radio"
                    name="orderType"
                    value={type}
                    checked={formData.orderType === type}
                    onChange={(e) =>
                      setFormData({ ...formData, orderType: e.target.value })
                    }
                    className="hidden"
                  />
                  <span className="text-lg font-semibold">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* PAYMENT TYPE */}
          <div>
            <label className="block text-sm mb-1">Payment Type</label>
            <select
              className="w-full p-2 rounded bg-gray-700"
              value={formData.paymentType}
              onChange={(e) =>
                setFormData({ ...formData, paymentType: e.target.value })
              }
            >
              <option value="cash">Cash</option>
              <option value="qris">QRIS</option>
            </select>
          </div>

          {/* DISCOUNT */}
          <div>
            <label className="block text-sm mb-1">
              Promo / Discount Transaksi (%)
            </label>
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-700"
              value={formData.discount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount: Number(e.target.value) || 0,
                })
              }
              placeholder="Contoh: 10 untuk 10%"
            />
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-sm mb-1">Catatan (Opsional)</label>
            <textarea
              rows="3"
              className="w-full p-2 rounded bg-gray-700"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Contoh: meja pojok, tanpa gula..."
            ></textarea>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2">
            <button
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold mt-4"
              onClick={(e) => saveOrder(e)}
            >
              SIMPAN
            </button>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold mt-4"
              onClick={(e) => handleSubmit(e)}
            >
              PAYMENT
            </button>
          </div>
        </div>
      </RightSidebar>
    </div>
  );
}
