const db = require("../database/db.config");

/* ============================================================
   📌 Generate Invoice Code (TRX-20250212-0001)
============================================================ */
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

/* ============================================================
   🧾 CREATE NEW TRANSACTION (HEADER)
============================================================ */
const createTransaction = async (data) => {
  return await db("transactions").insert(data);
};

/* ============================================================
   📦 GET ALL TRANSACTIONS
============================================================ */
const getAll = async () => {
  return await db("transactions as t")
    .leftJoin("users as u", "t.userId", "u.userId")
    .select(
      "t.transactionId",
      "t.invoiceCode",
      "t.orderType",
      "t.paymentType",
      "t.status",
      "t.totalAmount",
      "t.createdAt",
      "u.fullName as cashier"
    )
    .orderBy("t.createdAt", "desc");
};

/* ============================================================
   🔍 GET TRANSACTION BY ID
============================================================ */
const getById = async (transactionId) => {
  const trx = await db("transactions as t")
    .leftJoin("users as u", "t.userId", "u.userId")
    .select("t.*", "u.fullName as cashier")
    .where({ transactionId })
    .first();

  if (!trx) return null;

  // Ambil item
  trx.items = await getTransactionDetails(trx.invoiceCode);

  return trx;
};

/* ============================================================
   📝 UPDATE TRANSACTION
============================================================ */
const updateTransaction = async (transactionId, data) =>
  await db("transactions").where({ transactionId }).update(data);

/* ============================================================
   ❌ DELETE TRANSACTION
============================================================ */
const deleteTransaction = async (transactionId) =>
  await db("transactions").where({ transactionId }).del();

/* ============================================================
   📌 GET FULL TRANSACTION (DETAIL)
============================================================ */
const getTransactionDetails = async (invoiceCode) => {
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
      .leftJoin("product_variants as pv", "pv.variantId", "tiv.variantId")
      .select("pv.variantGroup", "pv.variantValue", "tiv.variantPrice")
      .where("tiv.transactionItemId", item.id);

    item.addons = await db("transaction_item_addons as tia")
      .leftJoin("product_addons as pa", "pa.addonId", "tia.addonId")
      .select("pa.addonName", "tia.addonPrice", "tia.quantity")
      .where("tia.transactionItemId", item.id);
  }

  return items;
};

/* ============================================================
   ➕ ADD ITEM TO TRANSACTION (+auto calculate subtotal)
============================================================ */
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

/* ============================================================
   ✏ UPDATE ITEM
============================================================ */
const updateTransactionItem = async (id, data) =>
  await db("transaction_items").where({ id }).update(data);

/* ============================================================
   ❌ DELETE ITEM
============================================================ */
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
};
