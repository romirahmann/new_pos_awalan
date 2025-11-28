const db = require("../database/db.config");

// 🔹 Ambil semua record cashbook
const getAllCashbook = async () =>
  db("cashbook as c")
    .select("c.*", "u.username as createdByName")
    .leftJoin("users as u", "c.createdBy", "u.userId");

// 🔹 Ambil cashbook berdasarkan ID
const getCashbookById = async (id) =>
  db("cashbook as c")
    .select("c.*", "u.username as createdByName")
    .leftJoin("users as u", "c.createdBy", "u.userId")
    .where({ id })
    .first();

// 🔹 Buat record cashbook baru
const createCashbook = async (data) => db("cashbook").insert(data);

// 🔹 Update record cashbook
const updateCashbook = async (id, data) =>
  db("cashbook").where({ id }).update(data);

// 🔹 Hapus record cashbook
const deleteCashbook = async (id) => db("cashbook").where({ id }).del();

module.exports = {
  getAllCashbook,
  getCashbookById,
  createCashbook,
  updateCashbook,
  deleteCashbook,
};
