const db = require("../database/db.config");

/* ============================================================
   🔹 GET ALL PRODUCTS (+ category, total varian & addons)
============================================================ */
const getAll = async () => {
  // 1. Ambil semua produk
  const products = await db("products as p")
    .leftJoin("categories as c", "c.categoryId", "p.categoryId")
    .select(
      "p.productId",
      "p.productName",
      "p.price",
      "p.cost",
      "p.productDesc",
      "p.isActive",
      "p.discount",
      "p.createdAt",
      "c.categoryId",
      "c.categoryName"
    )
    .orderBy("p.createdAt", "desc");

  // 2. Ambil variants semua produk
  const variants = await db("product_variants as pv").select(
    "pv.variantId",
    "pv.productId",
    "pv.variantGroup",
    "pv.variantValue",
    "pv.extraPrice"
  );

  // 3. Ambil addons semua produk
  const addons = await db("product_addons as pa").select(
    "pa.addonId",
    "pa.productId",
    "pa.addonName",
    "pa.price"
  );

  // 4. Gabungkan variants & addons ke masing-masing produk
  const result = products.map((prod) => ({
    ...prod,
    variants: variants.filter((v) => v.productId === prod.productId),
    addons: addons.filter((a) => a.productId === prod.productId),
  }));

  return result;
};

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
      "p.discount",
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
const create = async (products, variants = [], addons = []) => {
  return await db.transaction(async (trx) => {
    // 1️⃣ Insert product utama
    const [productId] = await trx("products").insert(products);

    // 2️⃣ Insert variants (jika ada)
    if (variants.length > 0) {
      const variantData = variants.map((v) => ({
        productId,
        variantValue: v.variantValue,
        extraPrice: v.extraPrice || 0,
      }));

      await trx("product_variants").insert(variantData);
    }

    // 3️⃣ Insert addons (jika ada)
    if (addons.length > 0) {
      const addonData = addons.map((a) => ({
        productId,
        addonName: a.addonName,
        price: a.price || 0,
      }));

      await trx("product_addons").insert(addonData);
    }

    return productId;
  });
};

/* ============================================================
   ✏ UPDATE PRODUCT
============================================================ */
const update = async (productId, data, variants = [], addons = []) => {
  return await db.transaction(async (trx) => {
    const { variants: _, addons: __, ...productOnly } = data;

    // 1️⃣ Update table products
    await trx("products").where({ productId }).update(productOnly);

    // 2️⃣ Hapus semua variants lama
    await trx("product_variants").where({ productId }).delete();

    // Insert variants baru
    if (variants.length > 0) {
      const variantData = variants.map((v) => ({
        productId,
        variantValue: v.variantValue,
        variantGroup: v.variantGroup || null,
        extraPrice: v.extraPrice || 0,
      }));

      await trx("product_variants").insert(variantData);
    }

    // 3️⃣ Hapus semua addons lama
    await trx("product_addons").where({ productId }).delete();

    // Insert addons baru
    if (addons.length > 0) {
      const addonData = addons.map((a) => ({
        productId,
        addonName: a.addonName,
        price: a.price || 0,
      }));

      await trx("product_addons").insert(addonData);
    }

    return true;
  });
};

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
      "p.discount",
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
