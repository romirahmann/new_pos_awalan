const db = require("../database/db.config");

// 🔹 Ambil semua kategori
const getAllCategories = async () =>
  db("categories").select("categoryId", "categoryName");

// 🔹 Ambil kategori berdasarkan ID
const getCategoryById = async (categoryId) =>
  db("categories")
    .select("categoryId", "categoryName")
    .where({ categoryId })
    .first();

// 🔹 Buat kategori baru
const createCategory = async (data) => db("categories").insert(data);

// 🔹 Update kategori
const updateCategory = async (categoryId, data) =>
  db("categories").where({ categoryId }).update(data);

// 🔹 Hapus kategori
const deleteCategory = async (categoryId) =>
  db("categories").where({ categoryId }).del();

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
