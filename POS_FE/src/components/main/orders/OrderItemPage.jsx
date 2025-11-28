/* eslint-disable no-unused-vars */
import { useState } from "react";
import { MenuSection } from "./MenuSection";
import { InvoiceSection } from "./InvoiceSection";
import RightSidebar from "../../../shared/RIghtBar";

export function OrderItemPage() {
  const [modal, setModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    paymentType: "Cash",
    orderType: "Dine In",
    notes: "",
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1.2fr] h-[calc(100vh-90px)] gap-6">
        <MenuSection cart={cart} setCart={setCart} />
        <InvoiceSection
          cart={cart}
          setCart={setCart}
          formData={formData}
          setModal={setModal}
        />
      </div>

      <RightSidebar isOpen={true} />

      {/* <PaymentModal
        isOpen={modal}
        onClose={() => setModal(false)}
        cart={cart}
        formData={formData}
        setFormData={setFormData}
        setCart={setCart}
      /> */}
    </div>
  );
}
