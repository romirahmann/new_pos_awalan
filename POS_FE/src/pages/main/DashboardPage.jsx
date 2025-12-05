export function DashboardPage() {
  return (
    <div className="p-6 rounded-2xl text-white min-h-screen bg-gray-900">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* =====================
          1. KPI SUMMARY
      ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Sales KPI */}
        <Card title="Sales Today" value="Rp 0" subtitle="+0% vs yesterday" />
        <Card
          title="Sales This Week"
          value="Rp 0"
          subtitle="+0% vs last week"
        />
        <Card
          title="Sales This Month"
          value="Rp 0"
          subtitle="+0% vs last month"
        />
        <Card title="Gross Profit" value="Rp 0" subtitle="Margin 0%" />
      </div>

      {/* 2nd row KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <Card title="Total Orders Today" value="0" subtitle="Avg per hour: 0" />
        <Card title="AOV" value="Rp 0" subtitle="Avg transaction value" />
        <Card title="Top Product Today" value="-" subtitle="Best seller" />
        <Card
          title="Net Cashflow Today"
          value="Rp 0"
          subtitle="Cashbook summary"
        />
      </div>

      {/* =====================
          2. ANALYTICS CHARTS
      ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartBox title="Daily Sales Trend (7–30 Days)" />
        <ChartBox title="Peak Hours (Jam Tersibuk)" />
      </div>

      {/* Category, Payment, Order Type */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <ChartBox title="Category Performance" />
        <ChartBox title="Payment Method Breakdown" />
        <ChartBox title="Order Type Breakdown" />
      </div>

      {/* =====================
          3. PRODUCT PERFORMANCE
      ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DataBox title="Top Selling Products" />
        <DataBox title="Low Stock & Critical Alerts" />
      </div>

      {/* =====================
          4. OPERATIONS
      ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <DataBox title="Recent Orders" />
        <QuickActions />
      </div>

      {/* =====================
          5. DAILY CASH SUMMARY
      ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Cash In Today" value="Rp 0" />
        <Card title="Cash Out Today" value="Rp 0" />
        <Card title="Net Cash Today" value="Rp 0" />
      </div>
    </div>
  );
}

/* ======== COMPONENTS ========= */

function Card({ title, value, subtitle }) {
  return (
    <div className="bg-[#161b22] border border-gray-700 p-4 rounded-xl">
      <p className="text-gray-400">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function ChartBox({ title }) {
  return (
    <div className="bg-[#161b22] p-4 border border-gray-700 rounded-xl h-72">
      <p className="text-gray-400 mb-2 font-medium">{title}</p>
      <div className="flex items-center justify-center text-gray-600 h-full italic">
        Chart Placeholder
      </div>
    </div>
  );
}

function DataBox({ title }) {
  return (
    <div className="bg-[#161b22] p-4 border border-gray-700 rounded-xl h-80">
      <p className="text-gray-400 mb-2 font-medium">{title}</p>
      <div className="flex items-center justify-center text-gray-600 h-full italic">
        Content Placeholder
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="bg-[#161b22] p-4 border border-gray-700 rounded-xl h-80">
      <p className="text-gray-400 mb-4 font-medium">Quick Actions</p>

      <div className="grid grid-cols-2 gap-3">
        <button className="bg-green-600 py-2 rounded-lg hover:bg-green-700">
          New Product
        </button>
        <button className="bg-blue-600 py-2 rounded-lg hover:bg-blue-700">
          Open POS
        </button>
        <button className="bg-purple-600 py-2 rounded-lg hover:bg-purple-700">
          New Cashbook Entry
        </button>
        <button className="bg-orange-600 py-2 rounded-lg hover:bg-orange-700">
          Add Expense
        </button>
      </div>
    </div>
  );
}
