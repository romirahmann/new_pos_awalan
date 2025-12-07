const db = require("../database/db.config");

/* ============================================================
   ⏳ DATE FILTER
============================================================ */
const dateFilter = (builder, type, column = "createdAt") => {
  if (type === "day") {
    builder.whereRaw(`DATE(${column}) = CURDATE()`);
  } else if (type === "month") {
    builder.whereRaw(`
      YEAR(${column}) = YEAR(CURDATE())
      AND MONTH(${column}) = MONTH(CURDATE())
    `);
  } else if (type === "year") {
    builder.whereRaw(`YEAR(${column}) = YEAR(CURDATE())`);
  }
};

/* ============================================================
   🔢 AUTO PARSE NUMBER
============================================================ */
const normalizeNumbers = (obj) => {
  if (Array.isArray(obj)) return obj.map(normalizeNumbers);

  if (obj && typeof obj === "object") {
    const result = {};
    for (const key in obj) {
      const val = obj[key];

      if (typeof val === "string" && val.trim() !== "" && !isNaN(val)) {
        result[key] = Number(val);
      } else {
        result[key] = normalizeNumbers(val);
      }
    }
    return result;
  }
  return obj;
};

/* ============================================================
   📌 1. OVERVIEW
============================================================ */
const getOverview = async (type) => {
  const trx = await db("transactions as t")
    .modify((q) => dateFilter(q, type, "t.createdAt"))
    .select(
      db.raw("COUNT(*) AS total_transactions"),
      db.raw("IFNULL(SUM(t.totalAmount), 0) AS revenue"),
      db.raw(
        `SUM(CASE WHEN paymentType = 'cash' THEN totalAmount ELSE 0 END) AS cash_income`
      ),
      db.raw(
        `SUM(CASE WHEN paymentType = 'qris' THEN totalAmount ELSE 0 END) AS qris_income`
      )
    )
    .first();

  const items = await db("transaction_items as ti")
    .join("transactions as t", "t.invoiceCode", "ti.invoiceCode")
    .modify((q) => dateFilter(q, type, "t.createdAt"))
    .sum({ total_items: "ti.quantity" })
    .first();

  return {
    ...trx,
    items_sold: items?.total_items || 0,
  };
};

/* ============================================================
   ⭐ 2. TOP PRODUCT
============================================================ */
const getTopProduct = async (type) => {
  return await db("transaction_items as ti")
    .join("products as p", "p.productId", "ti.productId")
    .join("categories as c", "c.categoryId", "p.categoryId")
    .join("transactions as t", "t.invoiceCode", "ti.invoiceCode")
    .modify((q) => dateFilter(q, type, "t.createdAt"))
    .select("p.productName", "c.categoryName")
    .sum({ total_sold: "ti.quantity" })
    .groupBy("ti.productId")
    .orderBy("total_sold", "desc")
    .first();
};

/* ============================================================
   📊 3. SALES TREND
============================================================ */
const getSalesTrend = async (type) => {
  if (type === "day") {
    return await db
      .from(
        db("transactions")
          .select(
            db.raw("DATE(createdAt) AS day"),
            db.raw("DATE(createdAt) AS label"),
            "totalAmount AS total"
          )
          .where(
            "createdAt",
            ">=",
            db.raw("DATE_SUB(CURDATE(), INTERVAL 7 DAY)")
          )
          .as("x")
      )
      .select("label")
      .sum({ total: "total" })
      .groupBy("day", "label")
      .orderBy("day");
  }

  if (type === "month") {
    return await db
      .from(
        db("transactions")
          .modify((q) => dateFilter(q, "month"))
          .select(
            db.raw("DATE(createdAt) AS day"),
            db.raw("DATE_FORMAT(createdAt, '%d %b') AS label"),
            "totalAmount AS total"
          )
          .as("x")
      )
      .select("label")
      .sum({ total: "total" })
      .groupBy("day", "label")
      .orderBy("day");
  }

  if (type === "year") {
    return await db
      .from(
        db("transactions")
          .modify((q) => dateFilter(q, "year"))
          .select(
            db.raw("MONTH(createdAt) AS month"),
            db.raw("DATE_FORMAT(createdAt, '%b') AS label"),
            "totalAmount AS total"
          )
          .as("x")
      )
      .select("label")
      .sum({ total: "total" })
      .groupBy("month", "label")
      .orderBy("month");
  }
};

/* ============================================================
   📦 CATEGORY SUMMARY
============================================================ */
const getCategorySummary = async (type) => {
  const rows = await db("transaction_items as ti")
    .join("products as p", "p.productId", "ti.productId")
    .join("categories as c", "c.categoryId", "p.categoryId")
    .join("transactions as t", "t.invoiceCode", "ti.invoiceCode")
    .modify((q) => dateFilter(q, type, "t.createdAt"))
    .select("c.categoryName")
    .sum({ total: "ti.quantity" })
    .groupBy("c.categoryId");

  return {
    coffee: rows.find((x) => x.categoryName === "COFFEE")?.total || 0,
    matcha: rows.find((x) => x.categoryName === "MATCHA")?.total || 0,
    nonCoffee: rows.find((x) => x.categoryName === "NON COFFEE")?.total || 0,
    food: rows.find((x) => x.categoryName === "FOOD")?.total || 0,
    dessert: rows.find((x) => x.categoryName === "DESSERT")?.total || 0,
  };
};

/* ============================================================
   ⭐ TOTAL & TOP PROFIT
============================================================ */
const getTopProfitProduct = async (type) => {
  return await db("transaction_items as ti")
    .join("products as p", "p.productId", "ti.productId")
    .join("transactions as t", "t.invoiceCode", "ti.invoiceCode")
    .modify((q) => dateFilter(q, type, "t.createdAt"))
    .select(
      "p.productName",
      db.raw("SUM((p.price - p.cost) * ti.quantity) AS total_profit")
    )
    .groupBy("ti.productId")
    .orderBy("total_profit", "desc")
    .first();
};

const getTotalProfit = async (type) => {
  const row = await db("transaction_items as ti")
    .join("products as p", "p.productId", "ti.productId")
    .join("transactions as t", "t.invoiceCode", "ti.invoiceCode")
    .modify((q) => dateFilter(q, type, "t.createdAt"))
    .select(db.raw("SUM((p.price - p.cost) * ti.quantity) AS totalProfit"))
    .first();

  return row?.totalProfit || 0;
};

/* ============================================================
   📊 PROFIT TREND
============================================================ */
const getProfitTrend = async (type) => {
  if (type === "day") {
    return await db
      .from(
        db("transaction_items as ti")
          .join("products as p", "p.productId", "ti.productId")
          .join("transactions as t", "t.invoiceCode", "ti.invoiceCode")
          .where(
            "t.createdAt",
            ">=",
            db.raw("DATE_SUB(CURDATE(), INTERVAL 7 DAY)")
          )
          .select(
            db.raw("DATE(t.createdAt) AS day"),
            db.raw("DATE(t.createdAt) AS label"),
            db.raw("(p.price - p.cost) * ti.quantity AS total")
          )
          .as("x")
      )
      .select("label")
      .sum({ total: "total" })
      .groupBy("day", "label")
      .orderBy("day");
  }

  if (type === "month") {
    return await db
      .from(
        db("transaction_items as ti")
          .join("products as p", "p.productId", "ti.productId")
          .join("transactions as t", "t.invoiceCode", "ti.invoiceCode")
          .modify((q) => dateFilter(q, "month", "t.createdAt"))
          .select(
            db.raw("DATE(t.createdAt) AS day"),
            db.raw("DATE_FORMAT(t.createdAt, '%d %b') AS label"),
            db.raw("(p.price - p.cost) * ti.quantity AS total")
          )
          .as("x")
      )
      .select("label")
      .sum({ total: "total" })
      .groupBy("day", "label")
      .orderBy("day");
  }

  if (type === "year") {
    return await db
      .from(
        db("transaction_items as ti")
          .join("products as p", "p.productId", "ti.productId")
          .join("transactions as t", "t.invoiceCode", "ti.invoiceCode")
          .modify((q) => dateFilter(q, "year", "t.createdAt"))
          .select(
            db.raw("MONTH(t.createdAt) AS month"),
            db.raw("DATE_FORMAT(t.createdAt, '%b') AS label"),
            db.raw("(p.price - p.cost) * ti.quantity AS total")
          )
          .as("x")
      )
      .select("label")
      .sum({ total: "total" })
      .groupBy("month", "label")
      .orderBy("month");
  }
};

/* ============================================================
   💰 CASHBOOK
============================================================ */
const getCashSummary = async (type) => {
  let rule = "";

  if (type === "day") rule = "DATE(recordDate) = CURDATE()";
  if (type === "month")
    rule =
      "YEAR(recordDate)=YEAR(CURDATE()) AND MONTH(recordDate)=MONTH(CURDATE())";
  if (type === "year") rule = "YEAR(recordDate)=YEAR(CURDATE())";

  const r = await db("cashbook")
    .select(
      db.raw("SUM(total_in) AS total_income"),
      db.raw("SUM(total_out) AS total_expense"),
      db.raw("SUM(total_in) - SUM(total_out) AS net_balance")
    )
    .whereRaw(rule)
    .first();

  return {
    total_income: Number(r?.total_income || 0),
    total_expense: Number(r?.total_expense || 0),
    net_balance: Number(r?.net_balance || 0),
  };
};

/* ============================================================
   🔥 COMPARISON (HARI INI VS KEMARIN, DST.)
============================================================ */
const getComparison = async (type) => {
  if (type === "day") {
    const today = await db("transactions")
      .whereRaw("DATE(createdAt) = CURDATE()")
      .sum({ total: "totalAmount" })
      .first();

    const yesterday = await db("transactions")
      .whereRaw("DATE(createdAt) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)")
      .sum({ total: "totalAmount" })
      .first();

    const t = Number(today?.total || 0);
    const y = Number(yesterday?.total || 0);

    return {
      today: t,
      yesterday: y,
      pctDay: y === 0 ? 100 : Math.round(((t - y) / y) * 100 * 100) / 100,
    };
  }

  if (type === "month") {
    const now = await db("transactions")
      .whereRaw(
        "YEAR(createdAt)=YEAR(CURDATE()) AND MONTH(createdAt)=MONTH(CURDATE())"
      )
      .sum({ total: "totalAmount" })
      .first();

    const last = await db("transactions")
      .whereRaw(
        "YEAR(createdAt)=YEAR(DATE_SUB(CURDATE(),INTERVAL 1 MONTH)) AND MONTH(createdAt)=MONTH(DATE_SUB(CURDATE(),INTERVAL 1 MONTH))"
      )
      .sum({ total: "totalAmount" })
      .first();

    const n = Number(now?.total || 0);
    const l = Number(last?.total || 0);

    return {
      thisMonth: n,
      lastMonth: l,
      pctMonth: l === 0 ? 100 : ((n - l) / l) * 100,
    };
  }

  if (type === "year") {
    const now = await db("transactions")
      .whereRaw("YEAR(createdAt)=YEAR(CURDATE())")
      .sum({ total: "totalAmount" })
      .first();

    const last = await db("transactions")
      .whereRaw("YEAR(createdAt)=YEAR(CURDATE())-1")
      .sum({ total: "totalAmount" })
      .first();

    const n = Number(now?.total || 0);
    const l = Number(last?.total || 0);

    return {
      thisYear: n,
      lastYear: l,
      pctYear: l === 0 ? 100 : ((n - l) / l) * 100,
    };
  }
};

/* ============================================================
   🚀 MAIN EXPORT
============================================================ */
const getDashboardData = async (type) => {
  const data = await Promise.all([
    getOverview(type),
    getTopProduct(type),
    getSalesTrend(type),
    getCategorySummary(type),
    getTotalProfit(type),
    getTopProfitProduct(type),
    getProfitTrend(type),
    getCashSummary(type),
    getComparison(type), // 🔥 penting!!
  ]);

  return normalizeNumbers({
    overview: data[0],
    topProduct: data[1],
    salesTrend: data[2],
    categorySummary: data[3],
    totalProfit: data[4],
    topProfitProduct: data[5],
    profitTrend: data[6],
    cashbook: data[7],
    comparison: data[8], // 🔥 dikirim ke FE
  });
};

module.exports = {
  getDashboardData,
  getSalesTrend,
};
