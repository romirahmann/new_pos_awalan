/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import "../../utils/chartConfig";

// =============================
// DASHBOARD PAGE
// =============================
export function DashboardPage() {
  const [filterType, setFilterType] = useState("day");
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(generateDummyData(filterType));
  }, [filterType]);

  if (!data) return <div className="text-white p-6">Loading...</div>;

  const {
    sales,
    categories,
    omzet,
    profit,
    revenueTrend,
    monthlySalesTrend,
    yearlySalesTrend,
  } = data;

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
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

      {/* KPI TOP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card
          title={`Penjualan (${filterType})`}
          value={`${sales.total_sales} transaksi`}
          subtitle={`Item terjual: ${sales.total_items}`}
        />

        <Card
          title="Minuman"
          value={`${categories.drinks.total} item`}
          subtitle={`Coffee: ${categories.drinks.coffee}, Matcha: ${categories.drinks.matcha}, Non Coffee: ${categories.drinks.noncoffee}`}
        />

        <Card
          title="Makanan"
          value={`${categories.food} item`}
          subtitle={`Dessert: ${categories.dessert}`}
        />

        <Card
          title={`Omzet (${filterType})`}
          value={toRupiah(omzet.total)}
          subtitle={`Harian: ${toRupiah(omzet.daily)}`}
        />
      </div>

      {/* KPI PROFIT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card title="Laba Harian" value={toRupiah(profit.daily)} />
        <Card title="Laba Bulanan" value={toRupiah(profit.monthly)} />
        <Card title="Laba Tahunan" value={toRupiah(profit.yearly)} />
      </div>

      {/* FULL SALES CHART - 1 ROW */}
      <ChartBox title="Grafik Penjualan (Full Width)" full>
        <Bar data={formatBar(monthlySalesTrend)} />
      </ChartBox>

      {/* REVENUE CHART */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox title={`Grafik Revenue (${filterType})`}>
          <Line data={formatLine(revenueTrend)} />
        </ChartBox>

        <ChartBox title="Grafik Penjualan Tahunan">
          <Line data={formatLine(yearlySalesTrend)} />
        </ChartBox>
      </div>
    </div>
  );
}

// =============================
// COMPONENTS
// =============================
function Card({ title, value, subtitle }) {
  return (
    <div className="bg-[#161b22] p-4 border border-gray-700 rounded-xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function ChartBox({ title, children, full }) {
  return (
    <div
      className={`bg-[#161b22] border border-gray-700 p-4 rounded-xl ${
        full ? "h-[420px] w-full" : "h-72"
      }`}
    >
      <p className="text-gray-400 mb-2">{title}</p>
      {children}
    </div>
  );
}

const toRupiah = (v) => `Rp ${Number(v).toLocaleString()}`;

// =============================
// CHART FORMATTERS
// =============================
function formatLine(data) {
  return {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Value",
        data: data.map((d) => d.value),
        borderColor: "#4ade80",
        tension: 0.4,
      },
    ],
  };
}

function formatBar(data) {
  return {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Penjualan",
        data: data.map((d) => d.value),
        backgroundColor: "#60a5fa",
      },
    ],
  };
}

// =============================
// DUMMY GENERATOR
// =============================
function generateDummyData(type) {
  const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  const generateTrend = (count, labelPrefix) =>
    [...Array(count)].map((_, i) => ({
      label: `${labelPrefix}${i + 1}`,
      value: rand(200_000, 1_000_000),
    }));

  return {
    sales: {
      total_sales: rand(20, 120),
      total_items: rand(40, 200),
    },

    categories: {
      drinks: {
        coffee: rand(10, 40),
        matcha: rand(5, 25),
        noncoffee: rand(5, 30),
        get total() {
          return this.coffee + this.matcha + this.noncoffee;
        },
      },
      food: rand(10, 40),
      dessert: rand(5, 20),
    },

    omzet: {
      daily: rand(1_000_000, 5_000_000),
      monthly: rand(25_000_000, 100_000_000),
      yearly: rand(300_000_000, 800_000_000),
      get total() {
        if (type === "day") return this.daily;
        if (type === "month") return this.monthly;
        return this.yearly;
      },
    },

    profit: {
      daily: rand(300_000, 1_500_000),
      monthly: rand(8_000_000, 40_000_000),
      yearly: rand(80_000_000, 250_000_000),
    },

    revenueTrend:
      type === "day"
        ? generateTrend(7, "D")
        : type === "month"
        ? generateTrend(30, "T")
        : generateTrend(12, "B"),

    monthlySalesTrend: generateTrend(30, "T"),

    yearlySalesTrend: generateTrend(12, "B"),
  };
}
