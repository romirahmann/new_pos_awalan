const dashboardModel = require("../../models/dashboard.model");
const api = require("../../utils/common");
const { emit } = require("../../services/socket.service");

/* ============================================================
   📊 GET DASHBOARD SUMMARY (day | month | year)
============================================================ */
const getDashboardSummary = async (req, res) => {
  try {
    // Default = day
    const type = req.query.type || "day";

    const data = await dashboardModel.getDashboardData(type);

    // Emit event untuk auto-update dashboard client
    emit("dashboard:refresh", data);

    return api.success(res, data);
  } catch (error) {
    console.error("❌ Error getDashboardSummary:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   📈 GET SALES TREND (day=7 hari, month=per hari dlm bulan ini, year=per bulan)
============================================================ */
const getSalesTrend = async (req, res) => {
  try {
    const type = req.query.type || "day";

    const trend = await dashboardModel.getSalesTrend(type);

    return api.success(res, trend);
  } catch (error) {
    console.error("❌ Error getSalesTrend:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   ⭐ TOP SELLING PRODUCTS (per type)
============================================================ */
const getTopSellingProducts = async (req, res) => {
  try {
    const type = req.query.type || "day";

    const products = await dashboardModel.getTopProducts(type);

    return api.success(res, products);
  } catch (error) {
    console.error("❌ Error getTopSellingProducts:", error);
    return api.error(res, "Internal Server Error");
  }
};

/* ============================================================
   💳 PAYMENT METHOD BREAKDOWN (cash, qris, card per type)
============================================================ */
const getPaymentBreakdown = async (req, res) => {
  try {
    const type = req.query.type || "day";

    const stats = await dashboardModel.getPaymentStats(type);

    return api.success(res, stats);
  } catch (error) {
    console.error("❌ Error getPaymentBreakdown:", error);
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
};
