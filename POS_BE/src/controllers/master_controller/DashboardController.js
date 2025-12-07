const dashboardModel = require("../../models/dashboard.model");
const api = require("../../utils/common");
const { emit } = require("../../services/socket.service");

const getDashboardSummary = async (req, res) => {
  try {
    const type = req.query.type || "day";
    const data = await dashboardModel.getDashboardData(type);
    return api.success(res, data);
  } catch (error) {
    console.error("❌ DASHBOARD ERROR:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

/* ============================================================
   📈 SALES TREND ONLY
============================================================ */
const getSalesTrend = async (req, res) => {
  try {
    const type = req.query.type || "day";
    const trend = await dashboardModel.getSalesTrend(type);

    return api.success(res, trend);
  } catch (error) {
    console.error("❌ Error getSalesTrend:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

/* ============================================================
   ⭐ TOP SELLING PRODUCTS
============================================================ */
const getTopSellingProducts = async (req, res) => {
  try {
    const type = req.query.type || "day";
    const products = await dashboardModel.getTopProducts(type);

    return api.success(res, products);
  } catch (error) {
    console.error("❌ Error getTopSellingProducts:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

/* ============================================================
   📦 CATEGORY SALES (COFFEE, MATCHA, FOOD, etc)
============================================================ */
const getCategorySales = async (req, res) => {
  try {
    const type = req.query.type || "day";
    const categories = await dashboardModel.getCategorySales(type);

    return api.success(res, categories);
  } catch (error) {
    console.error("❌ Error getCategorySales:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

/* ============================================================
   💳 PAYMENT METHOD BREAKDOWN
============================================================ */
const getPaymentBreakdown = async (req, res) => {
  try {
    const type = req.query.type || "day";
    const stats = await dashboardModel.getPaymentStats(type);

    return api.success(res, stats);
  } catch (error) {
    console.error("❌ Error getPaymentBreakdown:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

/* ============================================================
   🚀 EXPORT CONTROLLER
============================================================ */
module.exports = {
  getDashboardSummary,
  getSalesTrend,
  getTopSellingProducts,
  getCategorySales, // 🔥 tambahan baru
  getPaymentBreakdown,
};
