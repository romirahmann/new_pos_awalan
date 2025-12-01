const categoryModel = require("../../models/categories.model");
const api = require("../../utils/common");
const { emit } = require("../../services/socket.service");

/* ============================================================
   ✅ GET ALL CATEGORIES
============================================================ */
const getAllCategories = async (req, res) => {
  try {
    const data = await categoryModel.getAllCategories();
    return api.success(res, data);
  } catch (error) {
    console.log("❌ getAllCategories error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ GET CATEGORY BY ID
============================================================ */
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await categoryModel.getCategoryById(id);
    if (!data) return api.error(res, "Category not found", 404);

    return api.success(res, data);
  } catch (error) {
    console.log("❌ getCategoryById error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ CREATE CATEGORY
============================================================ */
const createCategory = async (req, res) => {
  try {
    const data = req.body;
    const result = await categoryModel.createCategory(data);

    // Emit Socket
    emit("categories:created", { categoryId: result[0], ...data });

    return api.success(
      res,
      { categoryId: result[0], ...data },
      "Category created"
    );
  } catch (error) {
    console.log("❌ createCategory error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ UPDATE CATEGORY
============================================================ */
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const existing = await categoryModel.getCategoryById(id);
    if (!existing) return api.error(res, "Category not found", 404);

    await categoryModel.updateCategory(id, data);

    // Emit Socket
    emit("categories:updated", { categoryId: id, ...data });

    return api.success(res, { categoryId: id, ...data }, "Category updated");
  } catch (error) {
    console.log("❌ updateCategory error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ✅ DELETE CATEGORY
============================================================ */
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await categoryModel.getCategoryById(id);
    if (!existing) return api.error(res, "Category not found", 404);

    await categoryModel.deleteCategory(id);

    // Emit Socket
    emit("categories:deleted", { categoryId: id });

    return api.success(res, "Category deleted successfully");
  } catch (error) {
    console.log("❌ deleteCategory error:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   🚀 EXPORT MODULE
============================================================ */
module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
