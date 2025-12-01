const db = require("../database/db.config");

/* ============================================================
   🔹 GET ALL ADDONS (dengan nama produk)
============================================================ */
const getAllAddons = async () =>
  db("product_addons as pa")
    .leftJoin("products as p", "p.productId", "pa.productId")
    .select(
      "pa.addonId",
      "pa.productId",
      "p.productName",
      "pa.addonName",
      "pa.price",
      "pa.isActive",
      "pa.createdAt"
    )
    .orderBy("pa.createdAt", "desc");

/* ============================================================
   🔹 GET ADDONS BY PRODUCT ID
============================================================ */
const getAddonsByProduct = async (productId) =>
  db("product_addons")
    .where({ productId, isActive: 1 })
    .select(
      "addonId",
      "productId",
      "addonName",
      "price",
      "isActive",
      "createdAt"
    )
    .orderBy("addonName", "asc");

/* ============================================================
   🔹 GET ADDON BY ID
============================================================ */
const getAddonById = async (addonId) =>
  db("product_addons").where({ addonId }).first();

/* ============================================================
   ➕ CREATE ADDON
============================================================ */
const createAddon = async (data) => db("product_addons").insert(data);

/* ============================================================
   ✏ UPDATE ADDON
============================================================ */
const updateAddon = async (addonId, data) =>
  db("product_addons").where({ addonId }).update(data);

/* ============================================================
   ❌ DELETE ADDON
============================================================ */
const deleteAddon = async (addonId) =>
  db("product_addons").where({ addonId }).del();

module.exports = {
  getAllAddons,
  getAddonsByProduct,
  getAddonById,
  createAddon,
  updateAddon,
  deleteAddon,
};
