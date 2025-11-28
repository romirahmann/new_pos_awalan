const trxModel = require("../../models/transaction.model");
const counterModel = require("../../models/counter.model");
const api = require("../../utils/common");
const { emit } = require("../../services/socket.service");

/* ============================================================
   ✅ GET ALL TRANSACTIONS
============================================================ */
const getAllTrx = async (req, res) => {
  try {
    const data = await trxModel.getAllTransaction();
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
    const data = await trxModel.getTransactionById(transactionId);
    if (!data) return api.error(res, "Transaction not found", 404);
    return api.success(res, data);
  } catch (error) {
    console.log("❌ getTrxById error:", error);
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

    const result = await trxModel.createdTransaction(data);
    const id = result[0];

    emit("transaction:created", { id, invoiceCode, ...data });

    return api.success(res, { id, invoiceCode }, "Transaction created");
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
    const existing = await trxModel.getTransactionById(transactionId);
    if (!existing) return api.error(res, "Transaction not found", 404);

    await trxModel.updateTransaction(transactionId, data);
    emit("transaction:updated", { id: transactionId, ...data });

    return api.success(
      res,
      { id: transactionId, ...data },
      "Transaction updated"
    );
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
    const existing = await trxModel.getTransactionById(transactionId);
    if (!existing) return api.error(res, "Transaction not found", 404);

    await trxModel.deleteDetailByTransactionId(transactionId);
    await trxModel.deletedTransaction(transactionId);

    emit("transaction:deleted", { id: transactionId });

    return api.success(res, "Transaction deleted successfully");
  } catch (error) {
    console.log("❌ deleteTrx error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ GET TRANSACTION DETAIL BY INVOICE CODE
============================================================ */
const getDetailTrx = async (req, res) => {
  const { invoiceCode } = req.params;
  try {
    const data = await trxModel.getDetailTransaction(invoiceCode);
    if (!data || data.length === 0)
      return api.error(res, "No detail found for this invoice", 404);
    return api.success(res, data);
  } catch (error) {
    console.log("❌ getDetailTrx error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ CREATE TRANSACTION DETAIL
============================================================ */
const createDetailTrx = async (req, res) => {
  try {
    const data = req.body;
    const result = await trxModel.createDetailTransaction(data);
    const id = result[0];

    emit("transaction_detail:created", { id, ...data });

    return api.success(res, { id, ...data }, "Detail added successfully");
  } catch (error) {
    console.log("❌ createDetailTrx error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ UPDATE TRANSACTION DETAIL
============================================================ */
const updateDetailTrx = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const existing = await trxModel.getDetailById(id);
    if (!existing) return api.error(res, "Detail not found", 404);

    await trxModel.updateDetailTransaction(id, data);
    emit("transaction_detail:updated", { id, ...data });

    return api.success(res, { id, ...data }, "Detail updated successfully");
  } catch (error) {
    console.log("❌ updateDetailTrx error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ DELETE TRANSACTION DETAIL
============================================================ */
const deleteDetailTrx = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await trxModel.getDetailById(id);
    if (!existing) return api.error(res, "Detail not found", 404);

    await trxModel.deleteDetailTransaction(id);

    emit("transaction_detail:deleted", { id });

    return api.success(res, "Detail deleted successfully");
  } catch (error) {
    console.log("❌ deleteDetailTrx error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   🚀 EXPORT MODULE
============================================================ */
module.exports = {
  getAllTrx,
  getTrxById,
  createTrx,
  updateTrx,
  deleteTrx,
  getDetailTrx,
  createDetailTrx,
  updateDetailTrx,
  deleteDetailTrx,
};
