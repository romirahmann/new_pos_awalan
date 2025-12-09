const PDFDocument = require("pdfkit");
const fs = require("fs");
const printer = require("pdf-to-printer");
const dayjs = require("dayjs");
const path = require("path");
async function printStruk(order) {
  try {
    const filePath = `./struk-${order.invoiceCode}.pdf`;

    const doc = new PDFDocument({
      size: [300, 1200], // FIXED ukuran 80mm (bukan 550)
      margin: 10,
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const logoPath = path.join(__dirname, "..", "image", "logo.png");

    try {
      const pageWidth = doc.page.width;
      const imageWidth = 100;
      const imageHeight = 100;
      const x = (pageWidth - imageWidth) / 2;

      // gambar di posisi center
      doc.image(logoPath, x, doc.y, {
        width: imageWidth,
        height: imageHeight,
      });

      // pindahkan Y ke bawah gambar
      doc.y += imageHeight + 10; // 10px jarak antara logo dan header
    } catch (e) {
      console.log("⚠️ Logo tidak ditemukan:", logoPath);
    }

    // HEADER
    doc.fontSize(16).text("AWALAN COFFEE", { align: "center" });
    doc.fontSize(10).text("Specialty Coffee & Matcha", { align: "center" });
    doc.fontSize(9).text("Jl. Raya Pangkalan, Kp. Jatilaksana, Karawang", {
      align: "center",
    });
    doc.text("--------------------------------");

    // INFO TRANSAKSI
    doc
      .fontSize(10)
      .text(`${dayjs().format("ddd, DD MMM YYYY")} | ${order.invoiceCode}`);
    doc.text(`Kasir : ${order.cashier}`);
    doc.text("--------------------------------");

    // ITEMS
    order.items.forEach((item) => {
      doc
        .fontSize(10)
        .text(
          `${item.productName}  ${item.qty} x ${item.price.toLocaleString()}`
        );

      if (item.variant) doc.text(` - ${item.variant}`);

      if (item.selectedAddons?.length) {
        item.selectedAddons.forEach((a) =>
          doc.text(` + ${a.addonName} (${a.price})`)
        );
      }

      doc.text(`= ${item.totalPrice.toLocaleString()}`);
      doc.moveDown(0.3);
    });

    doc.text("--------------------------------");

    // TOTAL
    doc.text(`Subtotal : ${order.subTotal.toLocaleString()}`);
    doc.text(`Diskon   : ${order.discount.toLocaleString()}`);
    doc.fontSize(12).text(`TOTAL    : ${order.totalAmount.toLocaleString()}`);
    doc.text("--------------------------------");

    // FOOTER
    doc
      .fontSize(10)
      .text("Terima kasih sudah berkunjung!", { align: "center" });
    doc.text("IG : @awalan.coffee", { align: "center" });
    doc.text('"Great Coffee. Good Vibes."', { align: "center" });

    doc.end();

    // TUNGGU PDF SELESAI DULU
    stream.on("finish", async () => {
      try {
        await printer.print(filePath, { printer: "EPSON TM-T82II Receipt" });
        console.log("✅ Struk dicetak!");
      } catch (err) {
        console.error("❌ Print error:", err);
      }
    });
  } catch (err) {
    console.error("❌ Error print struk:", err);
  }
}

module.exports = { printStruk };
