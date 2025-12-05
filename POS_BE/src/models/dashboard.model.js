const db = require("../database/db.config");

/* ============================================================
   🔹 OVERVIEW: TOTAL TRANSACTIONS + REVENUE
============================================================ */
const getOverview = async (type) => {
  let whereClause = "";

  if (type === "day") whereClause = "DATE(createdAt) = CURDATE()";
  if (type === "month")
    whereClause =
      "YEAR(createdAt) = YEAR(CURDATE()) AND MONTH(createdAt) = MONTH(CURDATE())";
  if (type === "year") whereClause = "YEAR(createdAt) = YEAR(CURDATE())";

  return await db("transactions")
    .select(
      db.raw("COUNT(*) AS total_transactions"),
      db.raw("SUM(totalAmount) AS revenue"),
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
    .whereRaw(whereClause)
    .first();
};

/* ============================================================
   💰 CASHFLOW SUMMARY
============================================================ */
const getCashflow = async (type) => {
  let whereClause = "";

  if (type === "day") whereClause = "recordDate = CURDATE()";
  if (type === "month")
    whereClause =
      "YEAR(recordDate) = YEAR(CURDATE()) AND MONTH(recordDate) = MONTH(CURDATE())";
  if (type === "year") whereClause = "YEAR(recordDate) = YEAR(CURDATE())";

  return await db("cashbook")
    .select(
      db.raw("IFNULL(SUM(total_in), 0) AS total_in"),
      db.raw("IFNULL(SUM(total_out), 0) AS total_out"),
      db.raw("IFNULL(SUM(net_balance), 0) AS net")
    )
    .whereRaw(whereClause)
    .first();
};

/* ============================================================
   💵 LAST NET BALANCE
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
const getTopProducts = async (type) => {
  let whereClause = "";

  if (type === "day") whereClause = "DATE(ti.createdAt) = CURDATE()";
  if (type === "month")
    whereClause =
      "YEAR(ti.createdAt) = YEAR(CURDATE()) AND MONTH(ti.createdAt) = MONTH(CURDATE())";
  if (type === "year") whereClause = "YEAR(ti.createdAt) = YEAR(CURDATE())";

  return await db("transaction_items as ti")
    .join("products as p", "p.productId", "ti.productId")
    .select("p.productName")
    .sum({ total_sold: "ti.quantity" })
    .whereRaw(whereClause)
    .groupBy("ti.productId")
    .orderBy("total_sold", "desc")
    .limit(5);
};

/* ============================================================
   📈 TREND DATA (HARIAN / BULANAN / TAHUNAN)
============================================================ */
const getSalesTrend = async (type) => {
  if (type === "day") {
    // Last 7 days
    return await db("transactions")
      .select(
        db.raw("DATE(createdAt) AS label"),
        db.raw("SUM(totalAmount) AS total")
      )
      .where("createdAt", ">=", db.raw("DATE_SUB(CURDATE(), INTERVAL 7 DAY)"))
      .groupByRaw("DATE(createdAt)")
      .orderBy("label", "asc");
  }

  if (type === "month") {
    // Trend per hari di bulan berjalan
    return await db("transactions")
      .select(
        db.raw("DAY(createdAt) AS label"),
        db.raw("SUM(totalAmount) AS total")
      )
      .whereRaw(
        "YEAR(createdAt) = YEAR(CURDATE()) AND MONTH(createdAt) = MONTH(CURDATE())"
      )
      .groupByRaw("DAY(createdAt)")
      .orderBy("label", "asc");
  }

  if (type === "year") {
    // Trend per bulan di tahun berjalan
    return await db("transactions")
      .select(
        db.raw("MONTH(createdAt) AS label"),
        db.raw("SUM(totalAmount) AS total")
      )
      .whereRaw("YEAR(createdAt) = YEAR(CURDATE())")
      .groupByRaw("MONTH(createdAt)")
      .orderBy("label", "asc");
  }
};

/* ============================================================
   💳 PAYMENT BREAKDOWN
============================================================ */
const getPaymentStats = async (type) => {
  let whereClause = "";

  if (type === "day") whereClause = "DATE(createdAt) = CURDATE()";
  if (type === "month")
    whereClause =
      "YEAR(createdAt) = YEAR(CURDATE()) AND MONTH(createdAt) = MONTH(CURDATE())";
  if (type === "year") whereClause = "YEAR(createdAt) = YEAR(CURDATE())";

  return await db("transactions")
    .select("paymentType")
    .sum({ total: "totalAmount" })
    .whereRaw(whereClause)
    .groupBy("paymentType");
};

/* ============================================================
   📊 CONTROLLER WRAPPER
============================================================ */
const getDashboardData = async (type) => {
  const overview = await getOverview(type);
  const cashflow = await getCashflow(type);
  const lastCash = await getLastCashBalance();
  const topProducts = await getTopProducts(type);
  const salesTrend = await getSalesTrend(type);
  const paymentStats = await getPaymentStats(type);

  return {
    overview,
    cashflow,
    lastCash: lastCash || { net_balance: 0 },
    topProducts,
    salesTrend,
    paymentStats,
  };
};

module.exports = {
  getDashboardData,
};
