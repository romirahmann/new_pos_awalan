const db = require("../database/db.config");

// 🔹 Ambil semua transaksi
const getAllTransaction = async () =>
  db("transactions as t")
    .select("t.*", "u.username")
    .leftJoin("users as u", "t.userId", "u.userId");

// 🔹 Ambil transaksi berdasarkan ID
const getTransactionById = async (transactionId) =>
  db("transactions as t")
    .select("t.*", "u.username")
    .leftJoin("users as u", "t.userId", "u.userId")
    .where({ transactionId })
    .first();

// 🔹 Buat transaksi baru
const createdTransaction = async (data) => db("transactions").insert(data);

// 🔹 Update transaksi
const updateTransaction = async (transactionId, data) =>
  db("transactions").where({ transactionId }).update(data);

// 🔹 Hapus transaksi
const deletedTransaction = async (transactionId) =>
  db("transactions").where({ transactionId }).del();

// ==========================
// DETAIL TRANSAKSI
// ==========================

// 🔹 Ambil semua detail item dari invoice
const getDetailTransaction = async (transactionId) =>
  db("transaction_items as td")
    .select("td.*", "p.productName", "p.price", "p.img", "c.categoryName")
    .leftJoin("products as p", "p.productId", "td.productId")
    .leftJoin("categories as c", "c.categoryId", "p.categoryId")
    .where("td.transactionId", transactionId);

// 🔹 Tambahkan item ke transaksi
const createDetailTransaction = async (data) =>
  db("transaction_items").insert(data);

// 🔹 Update item transaksi (misalnya ubah qty / harga)
const updateDetailTransaction = async (id, data) =>
  db("transaction_items").where({ id }).update(data);

// 🔹 Hapus satu item transaksi
const deleteDetailTransaction = async (id) =>
  db("transaction_items").where({ id }).del();

// 🔹 Hapus semua detail berdasarkan transactionId (jika transaksi dihapus)
const deleteDetailsByTransactionId = async (transactionId) =>
  db("transaction_items").where({ transactionId }).del();

module.exports = {
  getAllTransaction,
  getTransactionById,
  createdTransaction,
  updateTransaction,
  deletedTransaction,

  getDetailTransaction,
  createDetailTransaction,
  updateDetailTransaction,
  deleteDetailTransaction,
  deleteDetailsByTransactionId,
};
