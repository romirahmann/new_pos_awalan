const PDFDocument = require("pdfkit");
const fs = require("fs");
const printer = require("pdf-to-printer");
const dayjs = require("dayjs");
const path = require("path");

async function printStruk(order) {
  try {
    const filePath = `./struk-${order.invoiceCode}.pdf`;
    console.log("PRINT:", order);

    const doc = new PDFDocument({
      size: [300, 1200],
      margin: 10,
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ================= LOGO =================
    const logoPath = path.join(__dirname, "..", "image", "logo.png");

    try {
      const pageWidth = doc.page.width;
      const imageWidth = 100;
      const x = (pageWidth - imageWidth) / 2;

      doc.image(logoPath, x, doc.y, { width: imageWidth });
      doc.moveDown(1);
    } catch (e) {
      console.log("⚠️ Logo tidak ditemukan");
    }

    // ================= HEADER =================
    doc.fontSize(16).text("AWALAN COFFEE", { align: "center" });
    doc.fontSize(10).text("Specialty Coffee & Matcha", { align: "center" });
    doc.fontSize(8).text("Jl. Raya Pangkalan, Kp. Jatilaksana, Karawang", {
      align: "center",
    });

    doc.moveDown(0.5);
    doc.text("--------------------------------");

    // ================= INFO =================
    doc
      .fontSize(9)
      .text(`${dayjs().format("ddd, DD MMM YYYY")} | ${order.invoiceCode}`);
    doc.text(`Kasir   : ${order.cashier}`);
    doc.text(`Customer: ${order.customerName || "Customer"}`);

    doc.text("--------------------------------");

    // ================= ITEMS =================
    order.items.forEach((item) => {
      // Produk utama
      doc
        .fontSize(10)
        .text(
          `${item.productName}  ${
            item.quantity
          } x ${item.basePrice.toLocaleString()}`
        );

      // ================= VARIANT (AMAN) =================
      let variantText = "";

      // Prioritas: variant (string)
      if (item.variant) {
        variantText = item.variant;
      }
      // Fallback: variants (object / array)
      else if (item.variants) {
        console.log(item.variants);
        if (Array.isArray(item.variants)) {
          variantText =
            item.variants[0]?.variantValue ||
            item.variants[0]?.variantName ||
            "";
        } else {
          variantText =
            item.variants.variantValue || item.variants.variantName || "";
        }
      }

      if (variantText) {
        doc.fontSize(9).text(` - ${variantText}`);
      }

      // ================= ADDONS (CART) =================
      if (Array.isArray(item.selectedAddons)) {
        item.selectedAddons.forEach((addon) => {
          doc
            .fontSize(9)
            .text(
              ` + ${addon.addonName} (${addon.price?.toLocaleString() || 0})`
            );
        });
      }

      // ================= ADDONS (DB SAVE) =================
      if (Array.isArray(item.addons)) {
        item.addons.forEach((addon) => {
          doc
            .fontSize(9)
            .text(
              ` + ${addon.addonName} (${
                addon.addonPrice?.toLocaleString() || 0
              })`
            );
        });
      }

      // ================= TOTAL ITEM =================
      // doc.fontSize(10).text(` = ${item.totalPrice.toLocaleString()}`, {
      //   align: "right",
      // });

      doc.moveDown(0.4);
    });

    doc.text("--------------------------------");

    // ================= TOTAL =================
    doc.fontSize(10).text(`Subtotal : ${order.subTotal.toLocaleString()}`);
    doc.text(`Diskon   : ${order.discount.toLocaleString()}`);
    doc.fontSize(12).text(`TOTAL    : ${order.totalAmount.toLocaleString()}`);

    doc.text("--------------------------------");

    // ================= FOOTER =================
    doc.fontSize(9).text("Terima kasih sudah berkunjung!", {
      align: "center",
    });
    doc.text("IG : @awalan.coffee", { align: "center" });
    doc.text('"Let’s Make Today Better"', { align: "center" });

    doc.end();

    // ================= PRINT =================
    stream.on("finish", async () => {
      try {
        await printer.print(filePath, {
          printer: "EPSON TM-T82II Receipt",
        });
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
