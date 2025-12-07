// services/printer.service.js
const dayjs = require("dayjs");
const escpos = require("escpos");

// pastikan escpos-usb sudah terinstall
escpos.USB = require("escpos-usb");

// Ganti dengan vendorId & productId printer TM-T82II kamu
// Vendor/Prod biasanya Epson TM-T82II: vendorId = 0x04b8, productId = 0x0202
const VENDOR_ID = 0x04b8;
const PRODUCT_ID = 0x0202;

async function printStruk(order) {
  try {
    const device = new escpos.USB(VENDOR_ID, PRODUCT_ID);
    const printer = new escpos.Printer(device, { encoding: "GB18030" });

    device.open((err) => {
      if (err) {
        console.error("❌ Gagal membuka printer:", err);
        return;
      }

      // ===================== HEADER =====================
      printer
        .align("ct")
        .size(1, 1)
        .text("AWALAN COFFEE")
        .size(0, 0)
        .text("Specialty Coffee & Matcha")
        .text("Jl. Raya Pangkalan, Kp. Jatilaksana, Karawang")
        .text("--------------------------------");

      // ===================== INFO TRANSAKSI =====================
      printer
        .align("lt")
        .text(`${dayjs().format("ddd, DD MMM YYYY")} | ${order.invoiceCode}`)
        .text(`Kasir : ${order.cashier}`)
        .text("");

      // ===================== ITEMS =====================
      for (const item of order.items) {
        const name = item.productName.slice(0, 16).padEnd(16);
        const qty = String(item.qty).padStart(2);
        const price = item.price.toLocaleString().padStart(8);

        printer.text(`${name} ${qty} x ${price}`);

        // Variant
        if (item.variant) {
          printer.text(`  - ${item.variant}`);
        }

        // Addons
        if (item.selectedAddons?.length) {
          for (const addon of item.selectedAddons) {
            const addonPrice = addon.price.toLocaleString();
            printer.text(`  + ${addon.addonName} (${addonPrice})`);
          }
        }

        // Total item
        const itemTotal = item.totalPrice.toLocaleString().padStart(12);
        printer.text(`                = ${itemTotal}`);
      }

      printer.text("--------------------------------");

      // ===================== TOTAL =====================
      printer
        .align("rt")
        .text(`Subtotal     ${order.subTotal.toLocaleString()}`)
        .text(`Diskon       ${order.discount.toLocaleString()}`)
        .size(1, 1)
        .text(`TOTAL   ${order.totalAmount.toLocaleString()}`)
        .size(0, 0)
        .text("--------------------------------");

      // ===================== FOOTER =====================
      printer
        .align("ct")
        .text("Terima kasih sudah berkunjung!")
        .text("Follow kami:")
        .text("IG : @awalan.coffee")
        .text("TT : @awalan.coffee")
        .text("")
        .text('"Great Coffee. Good Vibes."')
        .text("--------------------------------")
        .text("Thank You")
        .text("\n\n")
        .cut()
        .close();
    });
  } catch (err) {
    console.error("❌ Error print struk:", err.message);
  }
}

module.exports = { printStruk };
