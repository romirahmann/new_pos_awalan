const cashbookModel = require("../../models/cashbook.model");
const api = require("../../utils/common");
const { emit } = require("../../services/socket.service");

/* ============================================================
   📄 GET ALL CASHBOOK RECORDS
============================================================ */
const getAllCashbook = async (req, res) => {
  try {
    const filters = req.query || {};
    const data = await cashbookModel.getAllCashbook(filters);
    return api.success(res, data);
  } catch (error) {
    console.error("❌ getAllCashbook error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   🔍 GET CASHBOOK BY ID
============================================================ */
const getCashbookById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await cashbookModel.getCashbookById(id);
    if (!data) return api.error(res, "Cashbook record not found", 404);
    return api.success(res, data);
  } catch (error) {
    console.error("❌ getCashbookById error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ➕ CREATE CASHBOOK RECORD
============================================================ */
const createCashbook = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      createdAt: new Date(),
      createdBy: req.user?.userId || req.body.createdBy || null,
    };

    const result = await cashbookModel.createCashbook(payload);
    const newRecord = { id: result[0], ...payload };

    emit("cashbook:created", newRecord);

    return api.success(res, newRecord);
  } catch (error) {
    console.error("❌ createCashbook error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✏ UPDATE CASHBOOK RECORD
============================================================ */
const updateCashbook = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const existing = await cashbookModel.getCashbookById(id);
    if (!existing) return api.error(res, "Cashbook record not found", 404);

    await cashbookModel.updateCashbook(id, data);

    emit("cashbook:updated", { id, ...data });

    return api.success(res, { id, ...data });
  } catch (error) {
    console.error("❌ updateCashbook error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   🗑 DELETE CASHBOOK RECORD
============================================================ */
const deleteCashbook = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await cashbookModel.getCashbookById(id);
    if (!existing) return api.error(res, "Cashbook record not found", 404);

    await cashbookModel.deleteCashbook(id);

    emit("cashbook:deleted", { id });

    return api.success(res, {
      message: "Cashbook record deleted successfully",
    });
  } catch (error) {
    console.error("❌ deleteCashbook error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   🚀 EXPORT MODULE
============================================================ */
module.exports = {
  getAllCashbook,
  getCashbookById,
  createCashbook,
  updateCashbook,
  deleteCashbook,
};
