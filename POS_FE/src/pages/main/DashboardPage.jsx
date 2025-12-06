// DashboardPage diperbaiki sesuai struktur backend baru

/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */

import { useCallback, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "../../utils/chartConfig";
import { ChartBox } from "../../components/main/dashboard/ChartBox";
import { Card } from "../../components/main/dashboard/Card";
import api from "../../services/axios.service";
import dayjs from "dayjs";

export function DashboardPage() {
  const [filterType, setFilterType] = useState("day");
  const [data, setData] = useState(null);

  const fetchSummaryData = useCallback(async () => {
    try {
      let res = await api.get(`/master/summary?type=${filterType}`);
      const d = res.data.data;

      console.log(res.data.data);

      setData(d);
    } catch (err) {
      console.log(err);
    }
  }, [filterType]);

  useEffect(() => {
    fetchSummaryData();
  }, [filterType, fetchSummaryData]);

  if (!data) return <div className="text-white p-6">Loading...</div>;

  const {
    overview,
    topProduct,
    salesTrend,
    categorySummary,
    paymentStats,
    topProfitProduct,
    totalProfit,
    profitTrend,
    comparison,
    cashbook,
  } = data;

  const trendData = salesTrend.map((d) => ({
    label: dayjs(d.label).format("DD MMM"),
    value: d.total,
  }));

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900 rounded-2xl">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-[#161b22] border border-gray-700 p-2 rounded-lg"
        >
          <option value="day">Harian</option>
          <option value="month">Bulanan</option>
          <option value="year">Tahunan</option>
        </select>
      </div>

      {/* KPI KOTAK ATAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card
          title="Total Transaksi"
          value={`${overview.total_transactions} transaksi`}
          subtitle={`Item terjual: ${overview.items_sold}`}
        />

        <Card
          title="Kategori Minuman"
          value={
            categorySummary.coffee +
            categorySummary.matcha +
            categorySummary.nonCoffee +
            " item"
          }
          subtitle={`Coffee: ${categorySummary.coffee}, Matcha: ${categorySummary.matcha}, Non Coffee: ${categorySummary.nonCoffee}`}
        />

        <Card
          title="Food & Dessert"
          value={`${categorySummary.food + categorySummary.dessert} item`}
          subtitle={`Food:${categorySummary.food}, Dessert: ${categorySummary.dessert}`}
        />

        <Card
          title="Omzet"
          value={toRupiah(overview.revenue)}
          subtitle={`Cash: ${toRupiah(overview.cash_income)}, QRIS: ${toRupiah(
            overview.qris_income
          )}`}
        />

        <Card
          title={`Top Product`}
          value={topProduct.productName}
          subtitle={`Total Sold: ${topProduct.total_sold}`}
        />
        <Card
          title="Top Profit Product"
          value={toRupiah(topProfitProduct.total_profit)}
          subtitle={`${topProfitProduct.productName}`}
        />
        <Card
          title={`Top Profit`}
          value={toRupiah(totalProfit)}
          subtitle={`Test`}
        />

        {filterType === "day" && (
          <Card
            title="Hari Ini vs Kemarin"
            value={`${comparison.pctDay}%`}
            subtitle={`Selisih: ${toRupiah(
              comparison.today - comparison.yesterday
            )}`}
          />
        )}

        {filterType === "month" && (
          <Card
            title="Bulan Ini vs Bulan Lalu"
            value={`${comparison.pctMonth}%`}
            subtitle={`Selisih: ${toRupiah(
              comparison.thisMonth - comparison.lastMonth
            )}`}
          />
        )}

        {filterType === "year" && (
          <Card
            title="Tahun Ini vs Tahun Lalu"
            value={`${comparison.pctYear}%`}
            subtitle={`Selisih: ${toRupiah(
              comparison.thisYear - comparison.lastYear
            )}`}
          />
        )}
      </div>

      <div className="chart grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* CHART */}
        <ChartBox title="Grafik Penjualan">
          <div className="w-full h-[350px]">
            <Line
              data={{
                labels: trendData.map((d) => d.label),
                datasets: [
                  {
                    label: "Penjualan",
                    data: trendData.map((d) => d.value),
                    borderColor: "#4F46E5",
                    backgroundColor: (ctx) => {
                      const gradient = ctx.chart.ctx.createLinearGradient(
                        0,
                        0,
                        0,
                        300
                      );
                      gradient.addColorStop(0, "rgba(79,70,229,0.2)");
                      gradient.addColorStop(1, "rgba(79,70,229,0)");
                      return gradient;
                    },
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 6,
                    pointBackgroundColor: "#4F46E5",
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `Rp ${context.parsed.y.toLocaleString()}`;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: "#2d2f36" },
                    ticks: {
                      color: "#9CA3AF",
                      callback: function (value) {
                        return `Rp ${value.toLocaleString()}`;
                      },
                    },
                  },
                  x: {
                    grid: { color: "#2d2f36" },
                    ticks: { color: "#9CA3AF" },
                  },
                },
              }}
            />
          </div>
        </ChartBox>
        <ChartBox title="Grafik Profit">
          <div className="w-full h-[350px]">
            <Line
              data={{
                labels: trendData.map((d) => d.label),
                datasets: [
                  {
                    label: "Profit",
                    data: profitTrend.map((d) => d.total),
                    borderColor: "white",
                    backgroundColor: (ctx) => {
                      const gradient = ctx.chart.ctx.createLinearGradient(
                        0,
                        0,
                        0,
                        300
                      );
                      gradient.addColorStop(0, "rgba(79,70,229,0.2)");
                      gradient.addColorStop(1, "rgba(79,70,229,0)");
                      return gradient;
                    },
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 6,
                    pointBackgroundColor: "white",
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `Rp ${context.parsed.y.toLocaleString()}`;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: "#2d2f36" },
                    ticks: {
                      color: "#9CA3AF",
                      callback: function (value) {
                        return `Rp ${value.toLocaleString()}`;
                      },
                    },
                  },
                  x: {
                    grid: { color: "#2d2f36" },
                    ticks: { color: "#9CA3AF" },
                  },
                },
              }}
            />
          </div>
        </ChartBox>
      </div>

      <div className="cashbook  mt-8">
        <div className="title">
          <h1 className="ms-2 text-2xl my-3">Cashbook Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card title={`Income`} value={toRupiah(cashbook.total_income)} />
          <Card title={`Expense`} value={toRupiah(cashbook.total_expense)} />
          <Card title={`Net Balance`} value={toRupiah(cashbook.net_balance)} />
        </div>
      </div>
    </div>
  );
}

const toRupiah = (v) => `Rp ${Number(v).toLocaleString()}`;
