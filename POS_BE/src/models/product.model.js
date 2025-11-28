const db = require("../database/db.config");

/* ============================================================
   ✅ GET ALL PRODUCTS
   Menampilkan semua produk beserta nama kategori
============================================================ */
const getAll = async () =>
  await db("products as p")
    .select(
      "p.productId",
      "p.productName",
      "p.price",
      "p.cost",
      "p.img",
      "p.productDesc",
      "p.isActive",
      "p.createdAt",
      "p.categoryId",
      "c.categoryName"
    )
    .leftJoin("categories as c", "c.categoryId", "p.categoryId")
    .orderBy("p.createdAt", "desc");

/* ============================================================
   ✅ GET PRODUCT BY ID
============================================================ */
const getById = async (productId) =>
  await db("products as p")
    .select(
      "p.productId",
      "p.productName",
      "p.price",
      "p.cost",
      "p.img",
      "p.productDesc",
      "p.isActive",
      "p.createdAt",
      "p.categoryId",
      "c.categoryName"
    )
    .leftJoin("categories as c", "c.categoryId", "p.categoryId")
    .where({ "p.productId": productId })
    .first();

/* ============================================================
   ✅ CREATE / REGISTER PRODUCT
============================================================ */
const create = async (data) => await db("products").insert(data);

/* ============================================================
   ✅ UPDATE PRODUCT
============================================================ */
const update = async (productId, data) =>
  await db("products").where({ productId }).update(data);

/* ============================================================
   ✅ DELETE PRODUCT
============================================================ */
const remove = async (productId) =>
  await db("products").where({ productId }).del();

/* ============================================================
   ✅ GET PRODUCTS BY CATEGORY
============================================================ */
const getByCategory = async (categoryId) =>
  await db("products as p")
    .select(
      "p.productId",
      "p.productName",
      "p.price",
      "p.cost",
      "p.img",
      "p.productDesc",
      "p.isActive",
      "p.createdAt",
      "p.categoryId",
      "c.categoryName"
    )
    .leftJoin("categories as c", "c.categoryId", "p.categoryId")
    .where({ "p.categoryId": categoryId })
    .andWhere("p.isActive", 1)
    .orderBy("p.productName", "asc");

/* ============================================================
   ✅ EXPORT MODULES
============================================================ */
module.exports = {
  getAll,
  getById,
  getByCategory,
  create,
  update,
  remove,
};
