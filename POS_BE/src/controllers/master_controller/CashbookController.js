const cashbookModel = require("../../models/cashbook.model");
const api = require("../../utils/common");
const { emit } = require("../../services/socket.service");

/* ============================================================
   ✅ GET ALL CASHBOOK RECORDS
============================================================ */
const getAllCashbook = async (req, res) => {
  try {
    const data = await cashbookModel.getAllCashbook();
    return api.success(res, data);
  } catch (error) {
    console.log("❌ getAllCashbook error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ GET CASHBOOK BY ID
============================================================ */
const getCashbookById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await cashbookModel.getCashbookById(id);
    if (!data) return api.error(res, "Cashbook record not found", 404);
    return api.success(res, data);
  } catch (error) {
    console.log("❌ getCashbookById error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ CREATE CASHBOOK RECORD
============================================================ */
const createCashbook = async (req, res) => {
  try {
    const data = req.body;
    const result = await cashbookModel.createCashbook(data);

    // Emit Socket, format: controller:action
    emit("cashbook:created", { id: result[0], ...data });

    return api.success(
      res,
      { id: result[0], ...data },
      "Cashbook record created"
    );
  } catch (error) {
    console.log("❌ createCashbook error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ UPDATE CASHBOOK RECORD
============================================================ */
const updateCashbook = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const existing = await cashbookModel.getCashbookById(id);
    if (!existing) return api.error(res, "Cashbook record not found", 404);

    await cashbookModel.updateCashbook(id, data);

    // Emit Socket
    emit("cashbook:updated", { id, ...data });

    return api.success(res, { id, ...data }, "Cashbook record updated");
  } catch (error) {
    console.log("❌ updateCashbook error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ DELETE CASHBOOK RECORD
============================================================ */
const deleteCashbook = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await cashbookModel.getCashbookById(id);
    if (!existing) return api.error(res, "Cashbook record not found", 404);

    await cashbookModel.deleteCashbook(id);

    // Emit Socket
    emit("cashbook:deleted", { id });

    return api.success(res, "Cashbook record deleted successfully");
  } catch (error) {
    console.log("❌ deleteCashbook error:", error);
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
