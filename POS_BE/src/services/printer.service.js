const PDFDocument = require("pdfkit");
const fs = require("fs");
const printer = require("pdf-to-printer");
const dayjs = require("dayjs");
const path = require("path");
async function printStruk(order) {
  try {
    const filePath = `./struk-${order.invoiceCode}.pdf`;
    // console.log(order);
    const doc = new PDFDocument({
      size: [300, 1200],
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

      doc.image(logoPath, x, doc.y, {
        width: imageWidth,
        height: imageHeight,
      });

      doc.y += imageHeight + 10;
    } catch (e) {
      console.log("⚠️ Logo tidak ditemukan:", logoPath);
    }

    // HEADER
    doc.fontSize(16).text("AWALAN COFFEE", { align: "center" });
    doc.fontSize(10).text("Specialty Coffee & Matcha", { align: "center" });
    doc.fontSize(8).text("Jl. Raya Pangkalan, Kp. Jatilaksana, Karawang", {
      align: "center",
    });
    doc.text("--------------------------------");

    // INFO TRANSAKSI
    doc
      .fontSize(10)
      .text(`${dayjs().format("ddd, DD MMM YYYY")} | ${order?.invoiceCode}`);
    doc.text(`Kasir : ${order.cashier}`);
    doc.text(`Customer: ${order.customerName || "Customer"}`);
    doc.text("------------------------------------");

    // ITEMS
    order.items.forEach((item) => {
      doc
        .fontSize(10)
        .text(
          `${item.productName}  ${
            item.quantity
          } x ${item.basePrice.toLocaleString()}`
        );

      // if (item.variant) doc.text(` - ${item.variant}`);
      if (item.variants) {
        console.log(item.variants);
        doc.text(
          ` - ${item.variants[0].variantValue || item.variants[0].variantName} `
        );
      }
      if (item.selectedAddons) {
        console.log("CO:", item.selectedAddons);
        item.selectedAddons.forEach((a) =>
          doc.text(` + ${a.addonName} (${a.price?.toLocaleString()})`)
        );
      }
      if (item.addons) {
        console.log("save:", item.addons);
        doc.text(
          ` + ${
            item?.addons[0]?.addonName
          } (${item?.addons[0]?.addonPrice?.toLocaleString()})`
        );
      }

      // doc.text(`= ${item?.totalPrice?.toLocaleString() ||  }`);
      doc.moveDown(0.3);
    });

    doc.text("--------------------------------");

    // TOTAL
    doc.text(`Subtotal : ${order?.subTotal?.toLocaleString() || 0}`);
    doc.text(`Diskon   : ${order?.discount?.toLocaleString() || 0}`);
    doc
      .fontSize(12)
      .text(`TOTAL    : ${order?.totalAmount?.toLocaleString() || 0}`);
    doc.text("--------------------------------");

    // FOOTER
    doc
      .fontSize(10)
      .text("Terima kasih sudah berkunjung!", { align: "center" });
    doc.text("IG : @awalan.coffee", { align: "center" });
    doc.text('"Let’s Make Today Better"', { align: "center" });

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
