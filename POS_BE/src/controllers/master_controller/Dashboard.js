const dashboardModel = require("../../models/Dashboard");
const api = require("../../utils/common");
const { emit } = require("../../services/socket.service");

/* ============================================================
   📊 GET DASHBOARD SUMMARY (KPI, Cashflow, Produk, Grafik)
============================================================ */
const getDashboardSummary = async (req, res) => {
  try {
    const data = await dashboardModel.getDashboardData();

    // Emit event agar dashboard di client bisa auto refresh
    emit("dashboard:refresh", data);

    return api.success(res, data);
  } catch (error) {
    console.error("❌ Error getDashboardSummary:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   📈 GET SALES TREND 7 DAYS
============================================================ */
const getSalesTrend = async (req, res) => {
  try {
    const trend = await dashboardModel.getLast7DaysRevenue();
    return api.success(res, trend);
  } catch (error) {
    console.error("❌ Error getSalesTrend:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ⭐ TOP SELLING PRODUCTS
============================================================ */
const getTopSellingProducts = async (req, res) => {
  try {
    const products = await dashboardModel.getTopProducts();
    return api.success(res, products);
  } catch (error) {
    console.error("❌ Error getTopSellingProducts:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   💳 PAYMENT METHOD BREAKDOWN
============================================================ */
const getPaymentBreakdown = async (req, res) => {
  try {
    const stats = await dashboardModel.getPaymentStats();
    return api.success(res, stats);
  } catch (error) {
    console.error("❌ Error getPaymentBreakdown:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   🔥 LOW STOCK ALERT
============================================================ */
const getLowStockAlerts = async (req, res) => {
  try {
    const stock = await dashboardModel.getLowStock();
    return api.success(res, stock);
  } catch (error) {
    console.error("❌ Error getLowStockAlerts:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   🚀 EXPORT MODULE
============================================================ */
module.exports = {
  getDashboardSummary,
  getSalesTrend,
  getTopSellingProducts,
  getPaymentBreakdown,
  getLowStockAlerts,
};
