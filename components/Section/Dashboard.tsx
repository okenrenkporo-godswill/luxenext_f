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

  if (ordersLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <Skeleton className="h-6 w-40 mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rouned-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (ordersError) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-3xl border border-red-100 italic">Failed to load dashboard data. Please try again.</div>;

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
      color: "bg-emerald-50 text-emerald-600"
    },
    { 
      title: "Total Orders", 
      value: totalOrders, 
      growth: "+8.2%", 
      isUp: true, 
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600" 
    },
    { 
      title: "Pending Payments", 
      value: pendingPayments, 
      growth: "-2.4%", 
      isUp: false, 
      icon: Clock,
      color: "bg-amber-50 text-amber-600" 
    },
    { 
      title: "Cancelled Orders", 
      value: cancelledOrders, 
      growth: "+0.5%", 
      isUp: false, 
      icon: XCircle,
      color: "bg-rose-50 text-rose-600" 
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
          gradient.addColorStop(0, "rgba(14, 75, 49, 0.15)");
          gradient.addColorStop(1, "rgba(14, 75, 49, 0.01)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#0e4b31",
        pointBorderColor: "#fff",
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
    <div className="space-y-8 pb-12">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-2xl ${m.color}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${m.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                {m.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {m.growth}
              </div>
            </div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{m.title}</p>
            <h4 className="text-2xl font-bold text-gray-900">{m.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
              <p className="text-sm text-gray-500">Sales performance across the year</p>
            </div>
            <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-[#0e4b31]/10">
              <option>Year 2026</option>
              <option>Year 2025</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <Line 
              data={revenueData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { display: false }, ticks: { font: { size: 11 } } },
                  x: { grid: { display: false }, ticks: { font: { size: 11 } } }
                }
              }} 
            />
          </div>
        </div>

        {/* Top Products Mini List */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
            <button className="text-[#0e4b31] text-sm font-semibold hover:underline">View all</button>
          </div>
          <div className="space-y-5">
            {topProducts.slice(0, 5).map((product: Product) => (
              <div key={product.id} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                  <img src={product.image_url || "/placeholder.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt={product.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-bold text-gray-900 truncate">{product.name}</h5>
                  <p className="text-xs text-gray-500 font-medium">₦{product.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">Best Seller</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <p className="text-sm text-gray-500">Managing the latest transactions</p>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Total</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5 text-sm font-bold text-gray-900">#{order.order_reference?.slice(-6) || order.id}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#0e4b31] text-[10px]">
                        {order.user.name?.slice(0, 2).toUpperCase() || "CN"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{order.user.name || "Customer"}</p>
                        <p className="text-[10px] text-gray-400 truncate">{order.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.order_status === "delivered" ? "bg-emerald-50 text-emerald-600" :
                      order.order_status === "pending" ? "bg-amber-50 text-amber-600" :
                      order.order_status === "cancelled" || order.order_status === "canceled" ? "bg-rose-50 text-rose-600" :
                      "bg-blue-50 text-blue-600"
                    }`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-900">₦{order.total_amount.toLocaleString()}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-gray-300 group-hover:text-[#0e4b31] transition-colors rounded-xl group-hover:bg-green-50">
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
