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

// Auto-parse semua value yang numerik
const normalizeNumbers = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(normalizeNumbers);
  }

  if (obj !== null && typeof obj === "object") {
    const result = {};
    for (const key in obj) {
      const value = obj[key];

      // jika value = "123" → 123
      if (
        typeof value === "string" &&
        value !== "" &&
        !isNaN(value) &&
        value.trim() !== ""
      ) {
        result[key] = Number(value);
      } else {
        result[key] = normalizeNumbers(value);
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
        "SUM(CASE WHEN paymentType = 'cash' THEN totalAmount ELSE 0 END) AS cash_income"
      ),
      db.raw(
        "SUM(CASE WHEN paymentType = 'qris' THEN totalAmount ELSE 0 END) AS qris_income"
      ),
      db.raw(
        "SUM(CASE WHEN paymentType = 'card' THEN totalAmount ELSE 0 END) AS card_income"
      )
    )
    .first();

  // Hitung total item terjual
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
   ⭐ 2. TOP PRODUCT (langsung ambil 1 terbaik)
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
   📊 3. SALES TREND (hasil sudah diformat FE-ready)
============================================================ */
const getSalesTrend = async (type) => {
  const trx = db("transactions");

  if (type === "day") {
    return await trx
      .where("createdAt", ">=", db.raw("DATE_SUB(CURDATE(), INTERVAL 7 DAY)"))
      .select(
        db.raw("DATE(createdAt) AS label"),
        db.raw("SUM(totalAmount) AS total")
      )
      .groupByRaw("DATE(createdAt)")
      .orderBy("label");
  }

  if (type === "month") {
    return await trx
      .modify((q) => dateFilter(q, "month"))
      .select(
        db.raw("DATE_FORMAT(createdAt, '%d %b') AS label"),
        db.raw("SUM(totalAmount) AS total")
      )
      .groupByRaw("DAY(createdAt)")
      .orderByRaw("DAY(createdAt)");
  }

  if (type === "year") {
    return await trx
      .modify((q) => dateFilter(q, "year"))
      .select(
        db.raw("DATE_FORMAT(createdAt, '%b') AS label"),
        db.raw("SUM(totalAmount) AS total")
      )
      .groupByRaw("MONTH(createdAt)")
      .orderByRaw("MONTH(createdAt)");
  }
};

/* ============================================================
   📦 4. SALES BY CATEGORY + summary object
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
    coffee: rows.find((r) => r.categoryName === "COFFEE")?.total || 0,
    matcha: rows.find((r) => r.categoryName === "MATCHA")?.total || 0,
    nonCoffee: rows.find((r) => r.categoryName === "NON COFFEE")?.total || 0,
    food: rows.find((r) => r.categoryName === "FOOD")?.total || 0,
    dessert: rows.find((r) => r.categoryName === "DESSERT")?.total || 0,
  };
};

/* ============================================================
   💳 5. PAYMENT STATS
============================================================ */
const getPaymentStats = async (type) => {
  return await db("transactions")
    .modify((q) => dateFilter(q, type))
    .select("paymentType")
    .sum({ total: "totalAmount" })
    .groupBy("paymentType");
};

/* ============================================================
   ⭐ TOP PROFIT PRODUCT
============================================================ */
const getTopProfitProduct = async (type) => {
  return await db("transaction_items as ti")
    .join("products as p", "p.productId", "ti.productId")
    .join("categories as c", "c.categoryId", "p.categoryId")
    .join("transactions as t", "t.invoiceCode", "ti.invoiceCode")
    .modify((q) => dateFilter(q, type, "t.createdAt"))
    .select(
      "p.productName",
      "c.categoryName",
      db.raw("SUM((p.price - p.cost) * ti.quantity) AS total_profit")
    )
    .groupBy("ti.productId")
    .orderBy("total_profit", "desc")
    .first();
};

const getTotalProfit = async (type) => {
  const rows = await db("transaction_items as ti")
    .join("products as p", "p.productId", "ti.productId")
    .join("transactions as t", "t.invoiceCode", "ti.invoiceCode")
    .modify((q) => dateFilter(q, type, "t.createdAt"))
    .select(db.raw("SUM((p.price - p.cost) * ti.quantity) AS totalProfit"))
    .first();

  return rows?.totalProfit || 0;
};

/* ============================================================
   📊 PROFIT TREND (FE-ready)
============================================================ */
const getProfitTrend = async (type) => {
  const trx = db("transaction_items as ti")
    .join("products as p", "p.productId", "ti.productId")
    .join("transactions as t", "t.invoiceCode", "ti.invoiceCode");

  if (type === "day") {
    return await trx
      .where("t.createdAt", ">=", db.raw("DATE_SUB(CURDATE(), INTERVAL 7 DAY)"))
      .select(
        db.raw("DATE(t.createdAt) AS label"),
        db.raw("SUM((p.price - p.cost) * ti.quantity) AS total")
      )
      .groupByRaw("DATE(t.createdAt)")
      .orderBy("label");
  }

  if (type === "month") {
    return await trx
      .modify((q) => dateFilter(q, "month", "t.createdAt"))
      .select(
        db.raw("DATE_FORMAT(t.createdAt, '%d %b') AS label"),
        db.raw("SUM((p.price - p.cost) * ti.quantity) AS total")
      )
      .groupByRaw("DAY(t.createdAt)")
      .orderByRaw("DAY(t.createdAt)");
  }

  if (type === "year") {
    return await trx
      .modify((q) => dateFilter(q, "year", "t.createdAt"))
      .select(
        db.raw("DATE_FORMAT(t.createdAt, '%b') AS label"),
        db.raw("SUM((p.price - p.cost) * ti.quantity) AS total")
      )
      .groupByRaw("MONTH(t.createdAt)")
      .orderByRaw("MONTH(t.createdAt)");
  }
};

const getDateComparison = async () => {
  const safeTotal = (val) => Number(val?.total || 0);

  const pct = (current, previous) => {
    if (previous === 0) {
      if (current === 0) return 0; // tidak ada perubahan
      return 100; // default: naik 100% kalau sebelumnya 0
    }

    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  // ==== Hari Ini ====
  const today = safeTotal(
    await db("transactions")
      .whereRaw("DATE(createdAt) = CURDATE()")
      .sum({ total: "totalAmount" })
      .first()
  );

  // ==== Kemarin ====
  const yesterday = safeTotal(
    await db("transactions")
      .whereRaw("DATE(createdAt) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)")
      .sum({ total: "totalAmount" })
      .first()
  );

  // ==== Minggu Ini ====
  const thisWeek = safeTotal(
    await db("transactions")
      .whereRaw("YEARWEEK(createdAt, 1) = YEARWEEK(CURDATE(), 1)")
      .sum({ total: "totalAmount" })
      .first()
  );

  // ==== Minggu Lalu ====
  const lastWeek = safeTotal(
    await db("transactions")
      .whereRaw(
        "YEARWEEK(createdAt, 1) = YEARWEEK(DATE_SUB(CURDATE(), INTERVAL 1 WEEK), 1)"
      )
      .sum({ total: "totalAmount" })
      .first()
  );

  // ==== Bulan Ini ====
  const thisMonth = safeTotal(
    await db("transactions")
      .whereRaw(
        "YEAR(createdAt) = YEAR(CURDATE()) AND MONTH(createdAt) = MONTH(CURDATE())"
      )
      .sum({ total: "totalAmount" })
      .first()
  );

  // ==== Bulan Lalu ====
  const lastMonth = safeTotal(
    await db("transactions")
      .whereRaw(
        `YEAR(createdAt) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) 
         AND MONTH(createdAt) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`
      )
      .sum({ total: "totalAmount" })
      .first()
  );

  return {
    today,
    yesterday,
    pctDay: pct(today, yesterday),

    thisWeek,
    lastWeek,
    pctWeek: pct(thisWeek, lastWeek),

    thisMonth,
    lastMonth,
    pctMonth: pct(thisMonth, lastMonth),
  };
};

const getCashSummary = async (type) => {
  let whereRaw;

  if (type === "day") {
    whereRaw = "DATE(recordDate) = CURDATE()";
  } else if (type === "month") {
    whereRaw = `
      YEAR(recordDate) = YEAR(CURDATE())
      AND MONTH(recordDate) = MONTH(CURDATE())
    `;
  } else if (type === "year") {
    whereRaw = "YEAR(recordDate) = YEAR(CURDATE())";
  } else {
    throw new Error("Invalid type for cash summary");
  }

  const row = await db("cashbook")
    .select(
      db.raw(`SUM(total_in) AS total_income`),
      db.raw(`SUM(total_out) AS total_expense`),
      db.raw(`SUM(total_in) - SUM(total_out) AS net_balance`)
    )
    .whereRaw(whereRaw)
    .first();

  return {
    total_income: Number(row?.total_income || 0),
    total_expense: Number(row?.total_expense || 0),
    net_balance: Number(row?.net_balance || 0),
  };
};

/* ============================================================
   🚀 FINAL RESPONSE MODEL
============================================================ */
const getDashboardData = async (type) => {
  const [
    overview,
    topProduct,
    salesTrend,
    categorySummary,
    paymentStats,
    totalProfit,
    topProfitProduct,
    profitTrend,
    comparison,
    cashbook,
  ] = await Promise.all([
    getOverview(type),
    getTopProduct(type),
    getSalesTrend(type),
    getCategorySummary(type),
    getPaymentStats(type),
    getTotalProfit(type),
    getTopProfitProduct(type),
    getProfitTrend(type),
    getDateComparison(),
    getCashSummary(type),
  ]);

  const raw = {
    overview,
    topProduct,
    salesTrend,
    categorySummary,
    paymentStats,
    totalProfit,
    topProfitProduct,
    profitTrend,
    comparison,
    cashbook,
  };

  // 🔥 PARSING DISINI
  const parsed = normalizeNumbers(raw);

  return parsed;
};

module.exports = {
  getDashboardData,
};
