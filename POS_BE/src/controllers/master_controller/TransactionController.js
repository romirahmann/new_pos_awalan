const trxModel = require("../../models/transaction.model");
const counterModel = require("../../models/counter.model");
const api = require("../../utils/common");
const { emit } = require("../../services/socket.service");
const { printStruk } = require("../../services/printer.service");

/* ============================================================
   ✅ GET ALL TRANSACTIONS
============================================================ */
const getAllTrx = async (req, res) => {
  let { date } = req.query;
  try {
    const data = await trxModel.getAll(date);
    return api.success(res, data);
  } catch (error) {
    console.log("❌ getAllTrx error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ GET TRANSACTION BY ID
============================================================ */
const getTrxById = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const data = await trxModel.getById(transactionId);
    if (!data) return api.error(res, "Transaction not found", 404);
    return api.success(res, data);
  } catch (error) {
    console.log("❌ getTrxById error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ GET TRANSACTION BY INVOICE CODE
============================================================ */
const getTrxByInvoiceCode = async (req, res) => {
  const { invoiceCode } = req.params;
  try {
    const data = await trxModel.getTransactionDetails(invoiceCode);
    if (!data || data.length === 0)
      return api.error(res, "No transaction found", 404);

    return api.success(res, data);
  } catch (error) {
    console.log("❌ getTrxByInvoiceCode error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ CREATE TRANSACTION
============================================================ */
const createTrx = async (req, res) => {
  let data = req.body;
  try {
    const invoiceCode = await counterModel.generateInvoiceCode();
    data = { ...data, invoiceCode };

    const result = await trxModel.createTransaction(data);
    const id = result[0];

    emit("transaction:created", id);

    return api.success(res, id);
  } catch (error) {
    console.log("❌ createTrx error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ SAVE TRANSACTION
============================================================ */
const saveTrx = async (req, res) => {
  let { transactionId } = req.params;
  let data = req.body;
  try {
    let formData = data.formData;
    let cart = data.cart;

    const trx = await trxModel.getById(transactionId);
    if (!trx) {
      return api.error(res, `Transaction Not Found!`, 500);
    }

    let totalDiscount = formData.totalAmount * (formData.discount / 100);
    formData.totalAmount = formData.totalAmount - totalDiscount;

    const result = await trxModel.saveTrx(trx.invoiceCode, formData, cart);

    emit("transaction:saved", result);

    return api.success(res, "result");
  } catch (error) {
    console.log("❌ createTrx error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ CHECKOUT TRANSACTION
============================================================ */
const checkOutTrx = async (req, res) => {
  let { transactionId } = req.params;
  let data = req.body;
  try {
    let formData = data.formData;
    let cart = data.cart;

    const trx = await trxModel.getById(transactionId);

    let dataStruk = {
      invoiceCode: trx.invoiceCode,
      cashier: trx.fullName,
      items: cart,
      subTotal: formData.subTotal,
      discount: formData.discount,
      totalAmount: formData.totalAmount,
    };

    if (!trx) {
      return api.error(res, `Transaction Not Found!`, 500);
    }

    let totalDiscount = formData.totalAmount * (formData.discount / 100);
    formData.totalAmount = formData.totalAmount - totalDiscount;

    formData.status = "paid";

    const result = await trxModel.checkOut(trx.invoiceCode, formData, cart);
    printStruk(dataStruk);
    emit("transaction:saved", result);

    return api.success(res, "result");
  } catch (error) {
    console.log("❌ createTrx error:", error);
    return api.error(res, "Internal Server Error");
  }
};
/* ============================================================
   ✅ UPDATE TRANSACTION
============================================================ */
const updateTrx = async (req, res) => {
  const { transactionId } = req.params;
  const data = req.body;
  try {
    await trxModel.updateTransaction(transactionId, data);
    emit("transaction:updated", { id: transactionId, ...data });

    return api.success(res, "Transaction updated");
  } catch (error) {
    console.log("❌ updateTrx error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ DELETE TRANSACTION
============================================================ */
const deleteTrx = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const existing = await trxModel.getById(transactionId);
    if (!existing) return api.error(res, "Transaction not found", 404);

    await trxModel.deleteTransaction(transactionId);

    emit("transaction:deleted", { id: transactionId });

    return api.success(res, "Transaction deleted successfully");
  } catch (error) {
    console.log("❌ deleteTrx error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ GET TRANSACTION DETAIL (ITEMS) BY INVOICE CODE
============================================================ */
const getItems = async (req, res) => {
  const { invoiceCode } = req.params;
  try {
    const data = await trxModel.getTransactionDetails(invoiceCode);
    return api.success(res, data);
  } catch (error) {
    console.log("❌ getItems error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ ADD ITEM TO TRANSACTION
============================================================ */
const addItem = async (req, res) => {
  try {
    const data = req.body;
    let items = {
      invoiceCode: data.invoiceCode,
      productId: data.productId,
      quantity: data.qty,
      basePrice: data.basePrice,
      subtotal: data.totalPrice,
      note: data.note,
    };

    let addOns = data.addons;
    let variant = data.variant;
    // console.log(items, addOns, variant);
    const result = await trxModel.addTransactionItem(items, variant, addOns);

    emit("transaction_item:created", result);

    return api.success(res, "Item added successfully");
  } catch (error) {
    console.log("❌ addItem error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ UPDATE ITEM
============================================================ */
const updateItem = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const existing = await trxModel.getTransactionDetails(data.invoiceCode);
    if (!existing) return api.error(res, "Item not found", 404);

    await trxModel.updateTransactionItem(id, data);

    emit("transaction_item:updated", { id, ...data });

    return api.success(res, { id, ...data }, "Item updated successfully");
  } catch (error) {
    console.log("❌ updateItem error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ❌ DELETE ITEM
============================================================ */
const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    await trxModel.deleteTransactionItem(id);

    emit("transaction_item:deleted", { id });

    return api.success(res, "Item deleted successfully");
  } catch (error) {
    console.log("❌ deleteItem error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ⏰ GET TRANSACTIONS BY DATE
============================================================ */
const getTrxByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const data = await trxModel.getAll();
    const filtered = data.filter((trx) =>
      trx.createdAt.toISOString().startsWith(date)
    );

    return api.success(res, filtered);
  } catch (error) {
    console.log("❌ getTrxByDate error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   🚀 EXPORT MODULE
============================================================ */
module.exports = {
  getAllTrx,
  getTrxById,
  getTrxByInvoiceCode,
  createTrx,
  updateTrx,
  deleteTrx,
  saveTrx,

  getItems,
  addItem,
  updateItem,
  deleteItem,
  checkOutTrx,
  getTrxByDate,
};
