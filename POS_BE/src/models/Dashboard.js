const db = require("../database/db.config");

/* ============================================================
   📊 GET DASHBOARD SUMMARY (KPI UTAMA)
   - total transaksi hari ini
   - revenue hari ini
   - breakdown per metode pembayaran
============================================================ */
const getTodayOverview = async () => {
  return await db("transactions")
    .select(
      db.raw("COUNT(*) AS total_transactions"),
      db.raw("SUM(totalAmount) AS revenue_today"),
      db.raw(
        "SUM(CASE WHEN paymentType = 'cash' THEN totalAmount ELSE 0 END) AS cash_income"
      ),
      db.raw(
        "SUM(CASE WHEN paymentType = 'qris' THEN totalAmount ELSE 0 END) AS qris_income"
      ),
      db.raw(
        "SUM(CASE WHEN paymentType = 'card' THEN totalAmount ELSE 0 END) AS card_income"
      ),
      db.raw(
        "SUM(CASE WHEN status = 'canceled' THEN totalAmount ELSE 0 END) AS canceled_amount"
      )
    )
    .whereRaw("DATE(createdAt) = CURDATE()")
    .first();
};

/* ============================================================
   💰 GET CASHFLOW SUMMARY TODAY
============================================================ */
const getTodayCashflow = async () => {
  return await db("cashbook")
    .select(
      db.raw("IFNULL(SUM(total_in), 0) AS total_in_today"),
      db.raw("IFNULL(SUM(total_out), 0) AS total_out_today"),
      db.raw("IFNULL(SUM(net_balance), 0) AS net_today")
    )
    .where("recordDate", db.raw("CURDATE()"))
    .first();
};

/* ============================================================
   💵 GET LAST NET BALANCE
============================================================ */
const getLastCashBalance = async () => {
  return await db("cashbook")
    .select("net_balance")
    .orderBy("recordDate", "desc")
    .orderBy("id", "desc")
    .first();
};

/* ============================================================
   ⭐ TOP 5 BEST SELLING PRODUCTS
============================================================ */
const getTopProducts = async () => {
  return await db("transaction_items as ti")
    .join("products as p", "p.productId", "ti.productId")
    .select("p.productName")
    .sum({ total_sold: "ti.qty" })
    .groupBy("ti.productId")
    .orderBy("total_sold", "desc")
    .limit(5);
};

/* ============================================================
   📈 LAST 7 DAYS SALES TREND
============================================================ */
const getLast7DaysRevenue = async () => {
  return await db("transactions")
    .select(
      db.raw("DATE(createdAt) AS date"),
      db.raw("SUM(totalAmount) AS total")
    )
    .where("createdAt", ">=", db.raw("DATE_SUB(CURDATE(), INTERVAL 7 DAY)"))
    .groupByRaw("DATE(createdAt)")
    .orderBy("date", "asc");
};

/* ============================================================
   💳 PAYMENT METHOD BREAKDOWN
============================================================ */
const getPaymentStats = async () => {
  return await db("transactions")
    .select("paymentType")
    .sum({ total: "totalAmount" })
    .groupBy("paymentType");
};

/* ============================================================
   📦 LOW STOCK ALERT (opsional)
============================================================ */
const getLowStock = async () => {
  return await db("products")
    .select("productName", "stock")
    .where("stock", "<=", 10) // kamu bisa ubah limit stok kritis
    .orderBy("stock", "asc")
    .limit(20);
};

/* ============================================================
   📊 CONTROLLER WRAPPER: RETURN ALL DASHBOARD DATA
============================================================ */
const getDashboardData = async () => {
  const overview = await getTodayOverview();
  const cashflow = await getTodayCashflow();
  const lastCash = await getLastCashBalance();
  const topProducts = await getTopProducts();
  const last7days = await getLast7DaysRevenue();
  const paymentStats = await getPaymentStats();
  const lowStock = await getLowStock();

  return {
    overview,
    cashflow,
    lastCash: lastCash || { net_balance: 0 },
    topProducts,
    last7days,
    paymentStats,
    lowStock,
  };
};

module.exports = {
  getTodayOverview,
  getTodayCashflow,
  getLastCashBalance,
  getTopProducts,
  getLast7DaysRevenue,
  getPaymentStats,
  getLowStock,
  getDashboardData,
};
