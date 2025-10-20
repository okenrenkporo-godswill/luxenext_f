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
} from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";
import { RotatingLines } from "react-loader-spinner"; // ✅ React UI Loader

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { data: orders = [], isLoading: ordersLoading, isError: ordersError } =
    useAdminOrders();
  const {
    data: topProducts = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useTopProducts();

  // ✅ SKELETON + SPINNER LOADER
  if (ordersLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        {/* Spinner */}
        <div className="flex justify-center items-center mb-10">
          <RotatingLines
            visible={true}
            height="30"
            width="30"
            color="rgb(0,0,0)" // Indigo-600
            strokeWidth="4"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
        </div>

        {/* Skeleton Content */}
        <div className="w-full animate-in fade-in-50">
          {/* HEADER */}
          <div className="mb-8">
            <Skeleton className="h-8 w-56 mb-3 mx-auto" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>

          {/* METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-6 w-32 mb-3" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>

          {/* TOP PRODUCTS */}
          <div className="bg-white shadow-sm rounded-2xl p-6 mb-8">
            <Skeleton className="h-5 w-40 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl bg-gray-50 border p-4">
                  <Skeleton className="h-40 w-full mb-3 rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                <Skeleton className="h-5 w-40 mb-4" />
                <Skeleton className="h-60 w-full rounded-lg" />
              </div>
            ))}
          </div>

          {/* RECENT ORDERS */}
          <div className="bg-white shadow-sm rounded-2xl p-6">
            <Skeleton className="h-5 w-48 mb-4" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (ordersError)
    return <p className="text-red-500 p-6">Failed to load orders</p>;

  // ------------------------
  // METRICS
  // ------------------------
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total_amount || 0),
    0
  );
  const totalOrders = orders.length;
  const pendingPayments = orders.filter(
    (o) => o.payment_status?.toLowerCase() === "pending"
  ).length;
  const cancelledOrders = orders.filter(
    (o) => o.order_status?.toLowerCase() === "cancelled"
  ).length;

  const metrics = [
    { title: "Total Orders", value: totalOrders, growth: "+0.9%" },
    {
      title: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      growth: "+1.4%",
    },
    { title: "Pending Payments", value: pendingPayments, growth: "+2.1%" },
    { title: "Cancelled Orders", value: cancelledOrders, growth: "-0.5%" },
  ];

  // ------------------------
  // SALES BY STATUS
  // ------------------------
  const statusList = ["delivered", "pending", "processing", "shipped", "cancelled"];
  const saleByStatusData = {
    labels: statusList.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [
      {
        label: "Orders",
        data: statusList.map(
          (status) =>
            orders.filter(
              (o) => o.order_status?.toLowerCase() === status
            ).length
        ),
        backgroundColor: [
          "#10B981",
          "#FBBF24",
          "#3B82F6",
          "#8B5CF6",
          "#EF4444",
        ],
        borderRadius: 8,
      },
    ],
  };

  // ------------------------
  // REVENUE BY MONTH
  // ------------------------
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
  ];
  const revenueData = {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data: months.map((month) =>
          orders
            .filter(
              (o) =>
                o.created_at &&
                new Date(o.created_at).toLocaleString("en-US", { month: "short" }) === month
            )
            .reduce((sum, o) => sum + (o.total_amount || 0), 0)
        ),
        borderColor: "#4F46E5",
        backgroundColor: "rgba(99,102,241,0.15)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  // ------------------------
  // RECENT ORDERS (10)
  // ------------------------
  const recentOrders: AdminOrderItem[] = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 10);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">
            Welcome back! Here’s what’s happening today.
          </p>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((card, i) => (
          <div
            key={i}
            className="bg-white shadow-sm hover:shadow-md transition-all rounded-2xl p-5 border border-gray-100"
          >
            <h3 className="text-gray-500 text-sm font-medium mb-2">
              {card.title}
            </h3>
            <p className="text-2xl font-semibold text-gray-900">
              {card.value}
            </p>
            <p className="text-green-500 text-sm mt-1">{card.growth}</p>
          </div>
        ))}
      </div>

      {/* TOP PRODUCTS */}
      <div className="bg-white shadow-sm rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🔥 Top Products
        </h3>
        {productsLoading ? (
          <div className="flex flex-col items-center justify-center">
            <RotatingLines
              visible={true}
              height="20"
              width="20"
              color="rgb(0,0,0)"
              strokeWidth="4"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              
              
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl bg-gray-50 border p-4">
                  <Skeleton className="h-40 w-full mb-3 rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          </div>
        ) : productsError ? (
          <p className="text-red-500">Failed to load top products</p>
        ) : topProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {topProducts.map((product: Product) => (
              <div
                key={product.id}
                className="rounded-xl bg-gray-50 border hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <img
                  src={product.image_url || "/placeholder.png"}
                  alt={product.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 truncate">
                    {product.name}
                  </h4>
                  <p className="text-gray-500 text-sm truncate mt-1">
                    {product.description}
                  </p>
                  <p className="text-indigo-600 font-bold mt-2">
                    ₦{product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No top products available</p>
        )}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sales by Status
          </h3>
          <Bar data={saleByStatusData} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Revenue Overview
          </h3>
          <Line data={revenueData} />
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white shadow-sm rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Order ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Amount
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Payment
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-2 text-sm text-gray-700">{order.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {order.user.email || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    ₦{(order.total_amount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {order.order_status || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {order.payment_status || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "N/A"}
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
