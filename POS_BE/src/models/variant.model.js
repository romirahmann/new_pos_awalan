const db = require("../database/db.config");

/* ============================================================
   🔹 GET ALL VARIANTS (dengan nama produk)
============================================================ */
const getAllVariants = async () =>
  db("product_variants as pv")
    .leftJoin("products as p", "p.productId", "pv.productId")
    .select(
      "pv.variantId",
      "pv.productId",
      "p.productName",
      "pv.variantGroup",
      "pv.variantValue",
      "pv.extraPrice",
      "pv.isActive",
      "pv.createdAt"
    )
    .orderBy("pv.createdAt", "desc");

/* ============================================================
   🔹 GET VARIANTS BY PRODUCT
============================================================ */
const getVariantsByProduct = async (productId) =>
  db("product_variants")
    .where({ productId, isActive: 1 })
    .select(
      "variantId",
      "productId",
      "variantGroup",
      "variantValue",
      "extraPrice",
      "isActive",
      "createdAt"
    )
    .orderBy("variantGroup", "asc");

/* ============================================================
   🔹 GET VARIANT BY ID
============================================================ */
const getVariantById = async (variantId) =>
  db("product_variants").where({ variantId }).first();

/* ============================================================
   🔹 CREATE VARIANT
============================================================ */
const createVariant = async (data) => db("product_variants").insert(data);

/* ============================================================
   🔹 UPDATE VARIANT
============================================================ */
const updateVariant = async (variantId, data) =>
  db("product_variants").where({ variantId }).update(data);

/* ============================================================
   🔹 DELETE VARIANT
============================================================ */
const deleteVariant = async (variantId) =>
  db("product_variants").where({ variantId }).del();

module.exports = {
  getAllVariants,
  getVariantsByProduct,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
};
