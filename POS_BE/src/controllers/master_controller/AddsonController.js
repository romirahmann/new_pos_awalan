const addonModel = require("../../models/addon.model");
const api = require("../../utils/common");
const { emit } = require("../../services/socket.service");

/* ============================================================
   📌 GET ALL ADDONS
============================================================ */
const getAllAddons = async (req, res) => {
  try {
    const data = await addonModel.getAllAddons();
    return api.success(res, data);
  } catch (error) {
    console.error("❌ getAllAddons error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   📌 GET ADDONS BY PRODUCT ID
============================================================ */
const getAddonsByProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const data = await addonModel.getAddonsByProduct(productId);
    return api.success(res, data);
  } catch (error) {
    console.error("❌ getAddonsByProduct error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   📌 GET ADDON BY ID
============================================================ */
const getAddonById = async (req, res) => {
  const { addonId } = req.params;
  try {
    const data = await addonModel.getAddonById(addonId);
    if (!data) return api.error(res, "Addon not found", 404);

    return api.success(res, data);
  } catch (error) {
    console.error("❌ getAddonById error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ➕ CREATE ADDON
============================================================ */
const createAddon = async (req, res) => {
  try {
    const data = req.body;
    const result = await addonModel.createAddon(data);

    emit("addon:created", { id: result[0], ...data });

    return api.success(res, { id: result[0], ...data });
  } catch (error) {
    console.error("❌ createAddon error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✏ UPDATE ADDON
============================================================ */
const updateAddon = async (req, res) => {
  const { addonId } = req.params;
  const data = req.body;

  try {
    const existing = await addonModel.getAddonById(addonId);
    if (!existing) return api.error(res, "Addon not found", 404);

    await addonModel.updateAddon(addonId, data);

    emit("addon:updated", { id: addonId, ...data });

    return api.success(res, { id: addonId, ...data });
  } catch (error) {
    console.error("❌ updateAddon error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ❌ DELETE ADDON
============================================================ */
const deleteAddon = async (req, res) => {
  const { addonId } = req.params;

  try {
    const existing = await addonModel.getAddonById(addonId);
    if (!existing) return api.error(res, "Addon not found", 404);

    await addonModel.deleteAddon(addonId);

    emit("addon:deleted", { id: addonId });

    return api.success(res, "Addon deleted successfully");
  } catch (error) {
    console.error("❌ deleteAddon error:", error);
    return api.error(res, "Internal Server Error");
  }
};

module.exports = {
  getAllAddons,
  getAddonsByProduct,
  getAddonById,
  createAddon,
  updateAddon,
  deleteAddon,
};
