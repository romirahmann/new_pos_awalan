const db = require("../database/db.config");

/* ============================================================
   🔹 GET ALL PRODUCTS (+ category, total varian & addons)
============================================================ */
const getAll = async () =>
  await db("products as p")
    .leftJoin("categories as c", "c.categoryId", "p.categoryId")
    .leftJoin("product_variants as pv", "pv.productId", "p.productId")
    .leftJoin("product_addons as pa", "pa.productId", "p.productId")
    .select(
      "p.productId",
      "p.productName",
      "p.price",
      "p.cost",
      "p.productDesc",
      "p.isActive",
      "p.createdAt",
      "c.categoryId",
      "c.categoryName"
    )
    .countDistinct("pv.variantId as variantCount")
    .countDistinct("pa.addonId as addonCount")
    .groupBy(
      "p.productId",
      "p.productName",
      "p.price",
      "p.cost",
      "p.productDesc",
      "p.isActive",
      "p.createdAt",
      "c.categoryId",
      "c.categoryName"
    )
    .orderBy("p.createdAt", "desc");

/* ============================================================
   🔹 GET PRODUCT BY ID WITH FULL DETAILS (grouped variants)
============================================================ */
const getById = async (productId) => {
  const product = await db("products as p")
    .leftJoin("categories as c", "c.categoryId", "p.categoryId")
    .select(
      "p.productId",
      "p.productName",
      "p.price",
      "p.cost",
      "p.productDesc",
      "p.isActive",
      "p.createdAt",
      "c.categoryId",
      "c.categoryName"
    )
    .where({ "p.productId": productId })
    .first();

  if (!product) return null;

  // Grouped variants by variantGroup
  const variants = await db("product_variants")
    .where({ productId, isActive: 1 })
    .select("variantId", "variantGroup", "variantValue", "extraPrice")
    .orderBy("variantGroup", "asc");

  const groupedVariants = variants.reduce((acc, v) => {
    acc[v.variantGroup] = acc[v.variantGroup] || [];
    acc[v.variantGroup].push(v);
    return acc;
  }, {});

  // Addons
  const addons = await db("product_addons")
    .where({ productId, isActive: 1 })
    .select("addonId", "addonName", "price");

  return { ...product, variants: groupedVariants, addons };
};

/* ============================================================
   🔹 GET VARIANTS PER PRODUCT
============================================================ */
const getProductVariants = async (productId) =>
  await db("product_variants")
    .where({ productId, isActive: 1 })
    .select("variantId", "variantGroup", "variantValue", "extraPrice");

/* ============================================================
   🔹 GET ADDONS PER PRODUCT
============================================================ */
const getProductAddons = async (productId) =>
  await db("product_addons")
    .where({ productId, isActive: 1 })
    .select("addonId", "addonName", "price");

/* ============================================================
   ➕ CREATE PRODUCT
============================================================ */
const create = async (data) => await db("products").insert(data);

/* ============================================================
   ✏ UPDATE PRODUCT
============================================================ */
const update = async (productId, data) =>
  await db("products").where({ productId }).update(data);

/* ============================================================
   ❌ DELETE PRODUCT
============================================================ */
const remove = async (productId) =>
  await db("products").where({ productId }).del();

/* ============================================================
   🔎 GET PRODUCTS BY CATEGORY
============================================================ */
const getByCategory = async (categoryId) =>
  await db("products as p")
    .leftJoin("categories as c", "c.categoryId", "p.categoryId")
    .where({ "p.categoryId": categoryId, "p.isActive": 1 })
    .select(
      "p.productId",
      "p.productName",
      "p.price",
      "p.productDesc",
      "c.categoryName"
    )
    .orderBy("p.productName", "asc");

/* ============================================================
   🔁 EXPORT MODULES
============================================================ */
module.exports = {
  getAll,
  getById,
  getByCategory,
  getProductVariants,
  getProductAddons,
  create,
  update,
  remove,
};
