"use client";

import React from "react";
import { useAdminOrders, useTopProducts } from "@/hook/queries";
import { Product, AdminOrderItem } from "@/lib/api";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";
import { RotatingLines } from "react-loader-spinner";
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  XCircle,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { useTheme } from "@/components/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { data: orders = [], isLoading: ordersLoading, isError: ordersError } =
    useAdminOrders();
  const {
    data: topProducts = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useTopProducts();
  const { isDark } = useTheme();

  if (ordersLoading) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 border shadow-sm ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
              <Skeleton className={`h-4 w-24 mb-4 ${isDark ? "bg-slate-700" : ""}`} />
              <Skeleton className={`h-8 w-32 mb-4 ${isDark ? "bg-slate-700" : ""}`} />
              <Skeleton className={`h-4 w-20 ${isDark ? "bg-slate-700" : ""}`} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className={`lg:col-span-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border shadow-sm ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
            <Skeleton className={`h-6 w-40 mb-6 ${isDark ? "bg-slate-700" : ""}`} />
            <Skeleton className={`h-48 sm:h-64 w-full ${isDark ? "bg-slate-700" : ""}`} />
          </div>
          <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 border shadow-sm ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
            <Skeleton className={`h-6 w-40 mb-6 ${isDark ? "bg-slate-700" : ""}`} />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className={`h-12 w-full rounded-xl ${isDark ? "bg-slate-700" : ""}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (ordersError) return <div className={`p-6 sm:p-8 text-center rounded-2xl sm:rounded-3xl border italic ${isDark ? "bg-rose-900/20 border-rose-800 text-rose-400" : "bg-red-50 border-red-100 text-red-500"}`}>Failed to load dashboard data. Please try again.</div>;

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalOrders = orders.length;
  const pendingPayments = orders.filter((o) => o.payment_status?.toLowerCase() === "pending" || o.payment_status?.toLowerCase() === "awaiting_confirmation").length;
  const cancelledOrders = orders.filter((o) => o.order_status?.toLowerCase() === "canceled" || o.order_status?.toLowerCase() === "cancelled").length;

  const metrics = [
    { 
      title: "Total Revenue", 
      value: `₦${totalRevenue.toLocaleString()}`, 
      growth: "+12.5%", 
      isUp: true, 
      icon: DollarSign,
      color: isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-50 text-emerald-600"
    },
    { 
      title: "Total Orders", 
      value: totalOrders, 
      growth: "+8.2%", 
      isUp: true, 
      icon: ShoppingBag,
      color: isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600" 
    },
    { 
      title: "Pending Payments", 
      value: pendingPayments, 
      growth: "-2.4%", 
      isUp: false, 
      icon: Clock,
      color: isDark ? "bg-amber-900/30 text-amber-400" : "bg-amber-50 text-amber-600" 
    },
    { 
      title: "Cancelled Orders", 
      value: cancelledOrders, 
      growth: "+0.5%", 
      isUp: false, 
      icon: XCircle,
      color: isDark ? "bg-rose-900/30 text-rose-400" : "bg-rose-50 text-rose-600" 
    },
  ];

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const revenueData = {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data: months.map((month) =>
          orders
            .filter((o) => o.created_at && new Date(o.created_at).toLocaleString("en-US", { month: "short" }) === month)
            .reduce((sum, o) => sum + (o.total_amount || 0), 0)
        ),
        borderColor: "#0e4b31",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, isDark ? "rgba(14, 75, 49, 0.25)" : "rgba(14, 75, 49, 0.15)");
          gradient.addColorStop(1, isDark ? "rgba(14, 75, 49, 0.02)" : "rgba(14, 75, 49, 0.01)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#0e4b31",
        pointBorderColor: isDark ? "#1e293b" : "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const statusList = ["delivered", "pending", "processing", "shipped", "canceled"];
  const saleByStatusData = {
    labels: statusList.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [
      {
        data: statusList.map(status => orders.filter(o => o.order_status?.toLowerCase() === (status === "canceled" ? "cancelled" : status) || o.order_status?.toLowerCase() === status).length),
        backgroundColor: ["#0e4b31", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"],
        borderRadius: 12,
        barThickness: 20,
      },
    ],
  };

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {metrics.map((m, i) => (
          <div key={i} className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 border shadow-sm hover:shadow-md transition-all duration-300 ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"
          }`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl ${m.color}`}>
                <m.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold ${
                m.isUp 
                  ? (isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-50 text-emerald-600") 
                  : (isDark ? "bg-rose-900/30 text-rose-400" : "bg-rose-50 text-rose-600")
              }`}>
                {m.isUp ? <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                {m.growth}
              </div>
            </div>
            <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{m.title}</p>
            <h4 className={`text-lg sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{m.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Main Chart */}
        <div className={`lg:col-span-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border shadow-sm ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Revenue Overview</h3>
              <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Sales performance across the year</p>
            </div>
            <select className={`border-none rounded-xl px-3 sm:px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#0e4b31]/20 ${
              isDark ? "bg-slate-700 text-gray-200" : "bg-gray-50 text-gray-600"
            }`}>
              <option>Year 2026</option>
              <option>Year 2025</option>
            </select>
          </div>
          <div className="h-[200px] sm:h-[300px] w-full">
            <Line 
              data={revenueData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { 
                    grid: { display: false, color: isDark ? "#334155" : "#f3f4f6" }, 
                    ticks: { font: { size: 10 }, color: isDark ? "#9ca3af" : "#6b7280" } 
                  },
                  x: { 
                    grid: { display: false }, 
                    ticks: { font: { size: 10 }, color: isDark ? "#9ca3af" : "#6b7280" } 
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Top Products Mini List */}
        <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border shadow-sm ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"
        }`}>
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Top Products</h3>
            <button className={`text-sm font-semibold hover:underline ${isDark ? "text-emerald-400" : "text-[#0e4b31]"}`}>View all</button>
          </div>
          <div className="space-y-4 sm:space-y-5">
            {topProducts.slice(0, 5).map((product: Product) => (
              <div key={product.id} className="flex items-center gap-3 sm:gap-4 group">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 border ${
                  isDark ? "bg-slate-700 border-slate-600" : "bg-gray-100 border-gray-200"
                }`}>
                  <img src={product.image_url || "/placeholder.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt={product.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className={`text-xs sm:text-sm font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{product.name}</h5>
                  <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>₦{product.price.toLocaleString()}</p>
                </div>
                <div className="text-right hidden sm:block">
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                      isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                    }`}>Best Seller</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className={`rounded-2xl sm:rounded-3xl border shadow-sm overflow-hidden ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"
      }`}>
        <div className={`p-4 sm:p-6 lg:p-8 border-b flex items-center justify-between ${isDark ? "border-slate-700" : "border-gray-50"}`}>
          <div>
            <h3 className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Recent Orders</h3>
            <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Managing the latest transactions</p>
          </div>
          <button className={`p-2 rounded-xl transition-colors ${isDark ? "text-gray-500 hover:text-gray-300 hover:bg-slate-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}>
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {recentOrders.map((order) => (
            <div key={order.id} className={`p-4 border-b last:border-b-0 ${isDark ? "border-slate-700" : "border-gray-100"}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  isDark ? "bg-slate-700 text-emerald-400" : "bg-gray-100 text-[#0e4b31]"
                }`}>
                  {order.user.name?.slice(0, 2).toUpperCase() || "CN"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{order.user.name || "Customer"}</p>
                  <p className={`text-[10px] truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}>#{order.order_reference?.slice(-6) || order.id}</p>
                </div>
                <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>₦{order.total_amount.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  order.order_status === "delivered" ? (isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-50 text-emerald-600") :
                  order.order_status === "pending" ? (isDark ? "bg-amber-900/30 text-amber-400" : "bg-amber-50 text-amber-600") :
                  order.order_status === "cancelled" || order.order_status === "canceled" ? (isDark ? "bg-rose-900/30 text-rose-400" : "bg-rose-50 text-rose-600") :
                  (isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600")
                }`}>
                  {order.order_status}
                </span>
                <button className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-gray-500 hover:text-emerald-400 hover:bg-slate-700" : "text-gray-300 hover:text-[#0e4b31] hover:bg-green-50"}`}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className={isDark ? "bg-slate-700/50" : "bg-gray-50/50"}>
                <th className={`px-6 lg:px-8 py-4 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Order ID</th>
                <th className={`px-6 lg:px-8 py-4 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Customer</th>
                <th className={`px-6 lg:px-8 py-4 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Status</th>
                <th className={`px-6 lg:px-8 py-4 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Total</th>
                <th className={`px-6 lg:px-8 py-4 text-xs font-bold uppercase tracking-widest text-right ${isDark ? "text-gray-400" : "text-gray-500"}`}>Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-gray-50"}`}>
              {recentOrders.map((order) => (
                <tr key={order.id} className={`transition-colors group ${isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-50/50"}`}>
                  <td className={`px-6 lg:px-8 py-5 text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>#{order.order_reference?.slice(-6) || order.id}</td>
                  <td className="px-6 lg:px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isDark ? "bg-slate-700 text-emerald-400" : "bg-gray-100 text-[#0e4b31]"
                      }`}>
                        {order.user.name?.slice(0, 2).toUpperCase() || "CN"}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{order.user.name || "Customer"}</p>
                        <p className={`text-[10px] truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}>{order.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.order_status === "delivered" ? (isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-50 text-emerald-600") :
                      order.order_status === "pending" ? (isDark ? "bg-amber-900/30 text-amber-400" : "bg-amber-50 text-amber-600") :
                      order.order_status === "cancelled" || order.order_status === "canceled" ? (isDark ? "bg-rose-900/30 text-rose-400" : "bg-rose-50 text-rose-600") :
                      (isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600")
                    }`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className={`px-6 lg:px-8 py-5 text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>₦{order.total_amount.toLocaleString()}</td>
                  <td className="px-6 lg:px-8 py-5 text-right">
                    <button className={`p-2 rounded-xl transition-colors ${isDark ? "text-gray-500 group-hover:text-emerald-400 group-hover:bg-slate-600" : "text-gray-300 group-hover:text-[#0e4b31] group-hover:bg-green-50"}`}>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

