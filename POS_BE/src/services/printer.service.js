const PDFDocument = require("pdfkit");
const fs = require("fs");
const printer = require("pdf-to-printer");
const dayjs = require("dayjs");

async function printStruk(order) {
  try {
    // 1️⃣ Buat PDF sementara
    const doc = new PDFDocument({ size: [300, 600] }); // 58mm width
    const filePath = `./struk-${order.invoiceCode}.pdf`;
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(14).text("AWALAN COFFEE", { align: "center" });
    doc.fontSize(10).text("Specialty Coffee & Matcha", { align: "center" });
    doc.text("Jl. Raya Pangkalan, Kp. Jatilaksana, Karawang", {
      align: "center",
    });
    doc.text("--------------------------------");

    doc.text(`${dayjs().format("ddd, DD MMM YYYY")} | ${order.invoiceCode}`);
    doc.text(`Kasir : ${order.cashier}`);
    doc.text("");
    doc.text("--------------------------------");

    order.items.forEach((item) => {
      doc.text(
        `${item.productName} ${item.qty} x ${item.price.toLocaleString()}`
      );
      if (item.variant) doc.text(`  - ${item.variant}`);
      if (item.selectedAddons?.length) {
        item.selectedAddons.forEach((a) =>
          doc.text(`  + ${a.addonName} (${a.price})`)
        );
      }
      doc.text(`= ${item.totalPrice.toLocaleString()}`);
    });

    doc.text("--------------------------------");
    doc.text(`Subtotal  : ${order.subTotal.toLocaleString()}`);
    doc.text(`Diskon    : ${order.discount.toLocaleString()}`);
    doc.fontSize(12).text(`TOTAL     : ${order.totalAmount.toLocaleString()}`);
    doc.text("--------------------------------");
    doc.text("Terima kasih sudah berkunjung!", { align: "center" });
    doc.text("IG : @awalan.coffee", { align: "center" });
    doc.text('"Great Coffee. Good Vibes."', { align: "center" });

    doc.end();

    // 2️⃣ Cetak PDF ke printer Windows
    await printer.print(filePath, { printer: "EPSON TM-T82II Receipt" });

    console.log("✅ Struk berhasil dicetak!");
  } catch (err) {
    console.error("❌ Error print struk:", err);
  }
}

module.exports = { printStruk };
