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
      // let summary = await api.get("/master/cashbook-summary?month=");
      // console.log(res.data.data);
      const d = res?.data?.data ?? {};

      console.log(d);
      setData(d);
    } catch (err) {
      console.log(err);
    }
  }, [filterType]);

  useEffect(() => {
    fetchSummaryData();
  }, [filterType, fetchSummaryData]);

  if (!data) return <div className="text-white p-6">Loading...</div>;

  // SAFE DEFAULTS
  const overview = data?.overview ?? {};
  const topProduct = data?.topProduct ?? {};
  const topProfitProduct = data?.topProfitProduct ?? {};
  const categorySummary = data?.categorySummary ?? {};
  const cashbook = data?.cashbook ?? {};

  const salesTrend = Array.isArray(data?.salesTrend) ? data.salesTrend : [];
  const profitTrend = Array.isArray(data?.profitTrend) ? data.profitTrend : [];

  const comparison = data?.comparison ?? {};

  const trendData =
    salesTrend?.map?.((d) => ({
      label: dayjs(d?.label).format("DD MMM"),
      value: d?.total ?? 0,
    })) ?? [];

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900 rounded-2xl">
      {/* HEADER */}
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

      {/* KPI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="KPI grid grid-cols-1 md:grid-cols-2 gap-2">
          <Card
            title="Total Transaksi"
            value={`${overview?.total_transactions ?? 0} transaksi`}
            subtitle={`Item terjual: ${overview?.items_sold ?? 0}`}
          />

          <Card
            title="Kategori Minuman"
            value={
              (categorySummary?.coffee ?? 0) +
              (categorySummary?.matcha ?? 0) +
              (categorySummary?.nonCoffee ?? 0) +
              " item"
            }
            subtitle={`Coffee: ${categorySummary?.coffee ?? 0}, Matcha: ${
              categorySummary?.matcha ?? 0
            }, Non Coffee: ${categorySummary?.nonCoffee ?? 0}`}
          />

          <Card
            title="Food & Dessert"
            value={`${
              (categorySummary?.food ?? 0) + (categorySummary?.dessert ?? 0)
            } item`}
            subtitle={`Food: ${categorySummary?.food ?? 0}, Dessert: ${
              categorySummary?.dessert ?? 0
            }`}
          />

          <Card
            title="Omzet"
            value={toRupiah(overview?.revenue ?? 0)}
            subtitle={`Cash: ${toRupiah(
              overview?.cash_income ?? 0
            )}, QRIS: ${toRupiah(overview?.qris_income ?? 0)}`}
          />

          <Card
            title="Top Profit Product"
            value={toRupiah(topProfitProduct?.total_profit ?? 0)}
            subtitle={`${topProfitProduct?.productName ?? "-"}`}
          />

          <Card
            title="Top Profit"
            value={toRupiah(data?.totalProfit ?? 0)}
            subtitle="Profit all transaction"
          />
        </div>

        <div className="TopProduct grid grid-cols-1 md:grid-cols-2 gap-2">
          <Card
            title="Top Product"
            value={topProduct?.bestGlobal?.productName ?? "-"}
            subtitle={`Total Sold: ${topProduct?.bestGlobal?.total_sold ?? 0}`}
          />

          {(topProduct?.topPerCategory ?? []).map?.((item, i) => (
            <Card
              key={i}
              title={`Best Seller: ${item?.categoryName ?? "-"}`}
              value={item?.productName ?? "-"}
              subtitle={`Total Sold: ${item?.total_sold ?? 0}`}
            />
          ))}
        </div>

        {filterType === "day" && (
          <Card
            title="Hari Ini vs Kemarin"
            value={`${comparison?.pctDay ?? 0}%`}
            subtitle={`Selisih: ${toRupiah(
              (comparison?.today ?? 0) - (comparison?.yesterday ?? 0)
            )}`}
          />
        )}

        {filterType === "month" && (
          <Card
            title="Bulan Ini vs Bulan Lalu"
            value={`${comparison?.pctMonth ?? 0}%`}
            subtitle={`Selisih: ${toRupiah(
              (comparison?.thisMonth ?? 0) - (comparison?.lastMonth ?? 0)
            )}`}
          />
        )}

        {filterType === "year" && (
          <Card
            title="Tahun Ini vs Tahun Lalu"
            value={`${comparison?.pctYear ?? 0}%`}
            subtitle={`Selisih: ${toRupiah(
              (comparison?.thisYear ?? 0) - (comparison?.lastYear ?? 0)
            )}`}
          />
        )}
      </div>

      {/* CHARTS */}
      <div className="chart grid grid-cols-1 lg:grid-cols-2 gap-2">
        <ChartBox title="Grafik Penjualan">
          <div className="w-full h-[350px]">
            <Line
              data={{
                labels: trendData?.map?.((d) => d?.label) ?? [],
                datasets: [
                  {
                    label: "Penjualan",
                    data: trendData?.map?.((d) => d?.value ?? 0) ?? [],
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
              options={chartOptions}
            />
          </div>
        </ChartBox>

        <ChartBox title="Grafik Profit">
          <div className="w-full h-[350px]">
            <Line
              data={{
                labels:
                  profitTrend?.map?.((d) => dayjs(d?.label).format("DD MMM")) ??
                  [],
                datasets: [
                  {
                    label: "Profit",
                    data: profitTrend?.map?.((d) => d?.total ?? 0) ?? [],
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
              options={chartOptions}
            />
          </div>
        </ChartBox>
      </div>

      {/* CASHBOOK */}
      <div className="cashbook mt-8">
        <div className="title">
          <h1 className="ms-2 text-2xl my-3">Cashbook Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card title="Income" value={toRupiah(cashbook?.total_income ?? 0)} />
          <Card
            title="Expense"
            value={toRupiah(cashbook?.total_expense ?? 0)}
          />
          <Card
            title="Net Balance"
            value={toRupiah(cashbook?.net_balance ?? 0)}
          />
        </div>
      </div>
    </div>
  );
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `Rp ${context.parsed.y?.toLocaleString()}`;
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
        callback: (value) => `Rp ${value?.toLocaleString()}`,
      },
    },
    x: {
      grid: { color: "#2d2f36" },
      ticks: { color: "#9CA3AF" },
    },
  },
};

const toRupiah = (v) => `Rp ${Number(v ?? 0).toLocaleString()}`;
