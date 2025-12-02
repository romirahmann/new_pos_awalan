const variantModel = require("../../models/variant.model");
const api = require("../../utils/common");
const { emit } = require("../../services/socket.service");

/* ============================================================
   📌 GET ALL VARIANTS
============================================================ */
const getAllVariants = async (req, res) => {
  try {
    const data = await variantModel.getAllVariants(); // ✔ sesuai model
    return api.success(res, data);
  } catch (error) {
    console.error("❌ getAllVariants error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   📌 GET VARIANTS BY PRODUCT ID
============================================================ */
const getVariantsByProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const data = await variantModel.getVariantsByProduct(productId); // ✔ sesuai model
    return api.success(res, data);
  } catch (error) {
    console.error("❌ getVariantsByProduct error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   📌 GET VARIANT BY ID
============================================================ */
const getVariantById = async (req, res) => {
  const { variantId } = req.params;
  try {
    const data = await variantModel.getVariantById(variantId); // ✔ sesuai model

    if (!data) return api.error(res, "Variant not found", 404);

    return api.success(res, data);
  } catch (error) {
    console.error("❌ getVariantById error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ➕ CREATE NEW VARIANT
============================================================ */
const createVariant = async (req, res) => {
  try {
    const data = req.body;

    const result = await variantModel.createVariant(data); // ✔ sesuai model

    emit("variant:created", { id: result[0], ...data });

    return api.success(res, { id: result[0], ...data });
  } catch (error) {
    console.error("❌ createVariant error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✏ UPDATE VARIANT
============================================================ */
const updateVariant = async (req, res) => {
  const { variantId } = req.params;
  const data = req.body;

  try {
    const existing = await variantModel.getVariantById(variantId); // ✔ sesuai model
    if (!existing) return api.error(res, "Variant not found", 404);

    await variantModel.updateVariant(variantId, data); // ✔ sesuai model

    emit("variant:updated", { id: variantId, ...data });

    return api.success(res, { id: variantId, ...data });
  } catch (error) {
    console.error("❌ updateVariant error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ❌ DELETE VARIANT
============================================================ */
const deleteVariant = async (req, res) => {
  const { variantId } = req.params;

  try {
    const existing = await variantModel.getVariantById(variantId); // ✔ sesuai model
    if (!existing) return api.error(res, "Variant not found", 404);

    await variantModel.deleteVariant(variantId); // ✔ sesuai model

    emit("variant:deleted", { id: variantId });

    return api.success(res, "Variant deleted successfully");
  } catch (error) {
    console.error("❌ deleteVariant error:", error);
    return api.error(res, "Internal Server Error");
  }
};

module.exports = {
  getAllVariants,
  getVariantsByProduct,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
};
