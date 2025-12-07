const db = require("../database/db.config");

const generateInvoiceCode = async () => {
  const today = new Date().toISOString().split("T")[0];

  const counter = await db("trx_counter").where({ trxDate: today }).first();

  if (!counter) {
    await db("trx_counter").insert({ trxDate: today, counter: 1 });
    return `AWLN-${today.replace(/-/g, "")}-0001`;
  }

  const newCount = counter.counter + 1;

  await db("trx_counter")
    .where({ trxDate: today })
    .update({ counter: newCount });

  return `TRX-${today.replace(/-/g, "")}-${String(newCount).padStart(4, "0")}`;
};

const createTransaction = async (data) => {
  return await db("transactions").insert(data);
};

const saveTrx = async (invoiceCode, formData, cart) => {
  const trx = await db.transaction();

  try {
    // ======================================================
    // 1️⃣ UPDATE TRANSACTION
    // ======================================================
    await trx("transactions").where({ invoiceCode }).update(formData);

    // ======================================================
    // 2️⃣ PROCESS CART ITEMS
    // ======================================================
    for (const item of cart) {
      // 2.1 INSERT TRANSACTION ITEM
      const itemPayload = {
        invoiceCode,
        productId: item.productId,
        quantity: item.qty,
        basePrice: item.price,
        subtotal: item.totalPrice,
        note: item.note || "",
      };

      const [id] = await trx("transaction_items").insert(itemPayload);

      // ======================================================
      // 2.2 INSERT VARIANT (if exists) -> USE YOUR TABLE STRUCTURE
      // ======================================================
      if (item.variant) {
        await trx("transaction_item_variants").insert({
          variantName: item.variant,
          transactionItemId: id,
          variantPrice: item.variant.variantPrice || 0,
        });
      }

      // ======================================================
      // 2.3 INSERT ADDONS (if exists) -> USE YOUR TABLE STRUCTURE
      // ======================================================
      if (item.selectedAddons && item.selectedAddons.length > 0) {
        for (const addon of item.selectedAddons) {
          await trx("transaction_item_addons").insert({
            transactionItemId: id,
            addonName: addon.addonName,
            addonPrice: addon.addonPrice || 0,
            quantity: addon.quantity || 1,
          });
        }
      }
    }

    await trx.commit();

    return trx;
  } catch (error) {
    console.error(error);
    await trx.rollback();
  }
};

const getAll = async (filter) => {
  const query = db("transactions as t")
    .leftJoin("users as u", "t.userId", "u.userId")
    .select(
      "t.transactionId",
      "t.invoiceCode",
      "t.orderType",
      "t.paymentType",
      "t.status",
      "t.totalAmount",
      "t.discount",
      "t.tax",
      "t.customerName",
      "t.createdAt",
      "u.fullName"
    )
    .orderBy("t.createdAt", "desc");

  if (filter === "day") {
    query.whereRaw("DATE(t.createdAt) = CURDATE()");
  } else if (filter === "month") {
    query.whereRaw(`
      YEAR(t.createdAt) = YEAR(CURDATE()) 
      AND MONTH(t.createdAt) = MONTH(CURDATE())
    `);
  } else if (filter === "year") {
    query.whereRaw("YEAR(t.createdAt) = YEAR(CURDATE())");
  }

  return await query;
};

const checkOut = async (invoiceCode, formData, cart) => {
  const trx = await db.transaction();

  try {
    await trx("transactions").where({ invoiceCode }).update(formData);

    for (const item of cart) {
      const itemPayload = {
        invoiceCode,
        productId: item.productId,
        quantity: item.qty,
        basePrice: item.price,
        subtotal: item.totalPrice,
        note: item.note || "",
      };

      const [id] = await trx("transaction_items").insert(itemPayload);

      if (item.variant) {
        await trx("transaction_item_variants").insert({
          variantName: item.variant,
          transactionItemId: id,
          variantPrice: item.variant.variantPrice || 0,
        });
      }

      if (item.selectedAddons && item.selectedAddons.length > 0) {
        for (const addon of item.selectedAddons) {
          await trx("transaction_item_addons").insert({
            transactionItemId: id,
            addonName: addon.addonName,
            addonPrice: addon.addonPrice || 0,
            quantity: addon.quantity || 1,
          });
        }
      }
    }

    await trx.commit();

    return trx;
  } catch (error) {
    console.error(error);
    await trx.rollback();
  }
};

const getById = async (transactionId) => {
  const trx = await db("transactions as t")
    .leftJoin("users as u", "t.userId", "u.userId")
    .select("t.*", "u.fullName")
    .where({ transactionId })
    .first();

  if (!trx) return null;

  // Ambil item
  trx.items = await getTransactionDetails(trx.invoiceCode);

  return trx;
};

const updateTransaction = async (transactionId, data) =>
  await db("transactions").where({ transactionId }).update(data);

const deleteTransaction = async (transactionId) =>
  await db("transactions").where({ transactionId }).del();

const getTransactionDetails = async (invoiceCode) => {
  const trx = await db("transactions as t")
    .leftJoin("users as u", "t.userId", "u.userId")
    .select("t.*", "u.fullName")
    .where({ invoiceCode })
    .first();
  // Ambil semua item transaksi
  const items = await db("transaction_items as ti")
    .leftJoin("products as p", "p.productId", "ti.productId")
    .select(
      "ti.id",
      "ti.invoiceCode",
      "ti.productId",
      "p.productName",
      "ti.quantity",
      "ti.basePrice",
      "ti.subtotal",
      "ti.note"
    )
    .where("ti.invoiceCode", invoiceCode);

  for (const item of items) {
    item.variants = await db("transaction_item_variants as tiv")
      .select("tiv.id", "tiv.variantName", "tiv.variantPrice")
      .where("tiv.transactionItemId", item.id);

    item.addons = await db("transaction_item_addons as tia")
      .select("tia.id", "tia.addonName", "tia.addonPrice", "tia.quantity")
      .where("tia.transactionItemId", item.id);
  }

  return { trx, items };
};

const addTransactionItem = async (data) => {
  const product = await db("products")
    .where({ productId: data.productId })
    .first();
  if (!product) throw new Error("Product not found");

  const basePrice = product.price;
  const subtotal = basePrice * data.quantity;

  const [id] = await db("transaction_items").insert({
    invoiceCode: data.invoiceCode,
    productId: data.productId,
    quantity: data.quantity,
    basePrice,
    subtotal,
    note: data.note || null,
  });

  return { id, ...data, basePrice, subtotal };
};

const updateTransactionItem = async (id, data) =>
  await db("transaction_items").where({ id }).update(data);

const deleteTransactionItem = async (id) =>
  await db("transaction_items").where({ id }).del();

module.exports = {
  generateInvoiceCode,
  createTransaction,
  getAll,
  getById,
  updateTransaction,
  deleteTransaction,
  getTransactionDetails,
  addTransactionItem,
  updateTransactionItem,
  deleteTransactionItem,
  saveTrx,
  checkOut,
};
