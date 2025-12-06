const db = require("../database/db.config");

/* ============================================================
   📄 GET ALL WITH FILTERS
============================================================ */
const getAllCashbook = async (filters = {}) => {
  const query = db("cashbook as c")
    .leftJoin("users as u", "c.createdBy", "u.userId")
    .select("c.*", "u.username as createdByName")
    .orderBy("c.recordDate", "desc");

  if (filters.date) query.where("recordDate", filters.date);
  if (filters.month && filters.year)
    query.whereRaw("MONTH(recordDate) = ? AND YEAR(recordDate) = ?", [
      filters.month,
      filters.year,
    ]);
  if (filters.type) query.where("entryType", filters.type);

  return await query;
};

/* ============================================================
   📄 GET SINGLE CASHBOOK
============================================================ */
const getCashbookById = async (id) =>
  db("cashbook as c")
    .leftJoin("users as u", "c.createdBy", "u.userId")
    .select("c.*", "u.username as createdByName")
    .where({ id })
    .first();

/* ============================================================
   📊 GET LAST RUNNING BALANCE
============================================================ */
const getLastBalance = async () => {
  const last = await db("cashbook")
    .select("running_balance")
    .orderBy("id", "desc")
    .first();

  return last ? Number(last.running_balance) : 0;
};

/* ============================================================
   ➕ CREATE NEW CASHBOOK ENTRY
============================================================ */
const createCashbook = async (data) => {
  return await db("cashbook").insert(data);
};

/* ============================================================
   ✏ UPDATE CASHBOOK ENTRY
============================================================ */
const updateCashbook = async (id, data) =>
  await db("cashbook").where({ id }).update(data);

/* ============================================================
   🗑 DELETE CASHBOOK ENTRY
============================================================ */
const deleteCashbook = async (id) => await db("cashbook").where({ id }).del();

/* ============================================================
   📊 GET MONTHLY SUMMARY
============================================================ */
const getCashSummary = async (month, year) => {
  return await db("cashbook")
    .select(
      db.raw(
        `SUM(CASE WHEN entryType = 'income' THEN amount ELSE 0 END) as total_income`
      ),
      db.raw(
        `SUM(CASE WHEN entryType = 'expense' THEN amount ELSE 0 END) as total_expense`
      ),
      db.raw(
        `SUM(CASE WHEN entryType = 'income' THEN amount ELSE -amount END) as net_balance`
      )
    )
    .whereRaw("MONTH(recordDate) = ? AND YEAR(recordDate) = ?", [month, year])
    .first();
};

module.exports = {
  getAllCashbook,
  getCashbookById,
  getLastBalance,
  createCashbook,
  updateCashbook,
  deleteCashbook,
  getCashSummary,
};
