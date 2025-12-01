const productModel = require("../../models/product.model");
const api = require("../../utils/common");
const { emit } = require("../../services/socket.service");

/* ============================================================
   🟢 CREATE PRODUCT
============================================================ */
const createProduct = async (req, res) => {
  try {
    const data = req.body;

    const result = await productModel.create(data);
    const createdId = result[0];

    emit("product:created", { id: createdId, ...data });

    return api.success(res, { id: createdId, ...data });
  } catch (error) {
    console.error("❌ Error createProduct:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   📦 GET ALL PRODUCTS
============================================================ */
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAll();
    return api.success(res, products);
  } catch (error) {
    console.error("❌ Error getAllProducts:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   🔍 GET PRODUCT BY ID
============================================================ */
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.getById(id);
    if (!product) return api.error(res, "Product not found");

    return api.success(res, product);
  } catch (error) {
    console.error("❌ Error getProductById:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✏ UPDATE PRODUCT
============================================================ */
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const existing = await productModel.getById(id);
    if (!existing) return api.error(res, "Product not found");

    await productModel.update(id, data);

    emit("product:updated", { id, ...data });

    return api.success(res, { id, ...data });
  } catch (error) {
    console.error("❌ Error updateProduct:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   🗑 DELETE PRODUCT
============================================================ */
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await productModel.getById(id);
    if (!existing) return api.error(res, "Product not found");

    await productModel.remove(id);

    emit("product:deleted", { id });

    return api.success(res, "Product deleted successfully");
  } catch (error) {
    console.error("❌ Error deleteProduct:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   📂 GET PRODUCTS BY CATEGORY
============================================================ */
const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await productModel.getByCategory(categoryId);
    return api.success(res, products);
  } catch (error) {
    console.error("❌ Error getProductsByCategory:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   🚀 EXPORT MODULE
============================================================ */
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};
