"use client";

import { useAdminOrders, useUpdateOrderStatus, useDeleteOrder } from "@/hook/queries";
import { 
  Loader2, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight,
  PackageCheck,
  CreditCard,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeContext";

export default function OrdersTable({ onSelectOrder }: { onSelectOrder: (id: number) => void }) {
  const { data: orders = [], isLoading, isError } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const { isDark } = useTheme();

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#0e4b31]" />
        <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>Fetching Orders...</p>
      </div>
    );

  if (isError)
    return (
      <div className={`p-8 sm:p-12 text-center rounded-2xl sm:rounded-[2rem] border italic ${
        isDark ? "bg-rose-900/20 border-rose-800 text-rose-400" : "bg-rose-50 border-rose-100 text-rose-500"
      }`}>
        Failed to fetch orders. Please check your connection.
      </div>
    );

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatus.mutate(
      {
        order_id: id,
        data: { status: newStatus as "pending" | "processing" | "shipped" | "delivered" | "canceled" },
      },
      {
        onSuccess: () => toast.success("Order status synchronized"),
        onError: () => toast.error("Update failed"),
      }
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Order Management</h1>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Monitor and fulfill your customer transactions</p>
      </div>

      {/* Main Container */}
      <div className={`rounded-2xl sm:rounded-[2rem] border shadow-sm overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"
      }`}>
        {/* Toolbar */}
        <div className={`p-4 sm:p-6 lg:p-8 border-b flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 ${
          isDark ? "border-slate-700" : "border-gray-50"
        }`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
              <input 
                type="text" 
                placeholder="Search by ID or Ref..."
                className={`w-full pl-10 pr-4 py-2.5 border-none rounded-xl sm:rounded-2xl text-sm focus:ring-2 focus:ring-[#0e4b31]/20 transition-all font-medium ${
                  isDark ? "bg-slate-700 text-gray-100 placeholder:text-gray-500" : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                }`}
              />
            </div>
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl sm:rounded-2xl ${isDark ? "bg-slate-700" : "bg-gray-50"}`}>
              <Filter className={`w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
              <span className={`text-sm font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>Filter By Status</span>
            </div>
          </div>
          <button className={`p-2.5 rounded-xl transition-colors ml-auto lg:ml-0 ${
            isDark ? "text-gray-500 hover:text-gray-300 hover:bg-slate-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          }`}>
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {orders.map((order) => (
            <div key={order.id} className={`p-4 border-b last:border-b-0 ${isDark ? "border-slate-700" : "border-gray-100"}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-[#0e4b31]/5 text-[#0e4b31]"
                }`}>
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>#{order.order_reference?.slice(-8) || order.id}</p>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{order.user.name}</p>
                  <div className={`flex items-center gap-1 text-[10px] mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    <Calendar className="w-3 h-3" />
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${isDark ? "text-white" : "text-gray-900"}`}>₦{order.total_amount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <select
                  value={order.order_status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={`flex-1 text-[10px] font-black uppercase tracking-widest border-none rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#0e4b31]/20 cursor-pointer ${
                    isDark ? "bg-slate-700" : "bg-gray-50"
                  } ${
                    order.order_status === "delivered" ? "text-emerald-500" :
                    order.order_status === "pending" ? "text-amber-500" :
                    order.order_status === "canceled" || order.order_status === "cancelled" ? "text-rose-500" :
                    "text-blue-500"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Cancelled</option>
                </select>
                <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                  order.payment_status === "paid" 
                    ? (isDark ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-50 text-emerald-600") 
                    : order.payment_status === "awaiting_confirmation" 
                      ? (isDark ? "bg-amber-900/50 text-amber-400" : "bg-amber-50 text-amber-600") 
                      : (isDark ? "bg-rose-900/50 text-rose-400" : "bg-rose-50 text-rose-600")
                }`}>
                  {order.payment_status}
                </span>
              </div>

              <div className={`flex items-center gap-2 pt-3 border-t border-dashed ${isDark ? "border-slate-700" : "border-gray-100"}`}>
                <button 
                  onClick={() => onSelectOrder(order.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${
                    isDark ? "text-gray-400 hover:text-emerald-400 hover:bg-slate-700" : "text-gray-500 hover:text-[#0e4b31] hover:bg-green-50"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button 
                  onClick={() => { if(confirm("Discard order record?")) deleteOrder.mutate(order.id) }}
                  disabled={deleteOrder.isPending}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${
                    isDark ? "text-gray-400 hover:text-rose-400 hover:bg-slate-700" : "text-gray-500 hover:text-rose-600 hover:bg-rose-50"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className={isDark ? "bg-slate-700/50" : "bg-gray-50/50"}>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Order Details</th>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Customer</th>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Status / Fulfill</th>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>Payment</th>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Amount</th>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest text-right ${isDark ? "text-gray-400" : "text-gray-500"}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-gray-50"}`}>
              {orders.map((order) => (
                <tr key={order.id} className={`transition-all group ${isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-50/50"}`}>
                  <td className="px-6 lg:px-8 py-5 lg:py-6">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className={`w-10 h-10 rounded-xl lg:rounded-2xl flex items-center justify-center ${
                        isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-[#0e4b31]/5 text-[#0e4b31]"
                      }`}>
                        <PackageCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>#{order.order_reference?.slice(-8) || order.id}</p>
                        <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                           <Calendar className="w-3 h-3" />
                           {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-5 lg:py-6">
                    <div className="min-w-[120px]">
                      <p className={`text-sm font-bold truncate ${isDark ? "text-gray-200" : "text-gray-700"}`}>{order.user.name}</p>
                      <p className={`text-[10px] font-medium truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}>{order.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-5 lg:py-6">
                    <div className="flex flex-col gap-2">
                       <select
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-widest border-none rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-[#0e4b31]/20 cursor-pointer ${
                          isDark ? "bg-slate-700" : "bg-gray-50"
                        } ${
                          order.order_status === "delivered" ? "text-emerald-500" :
                          order.order_status === "pending" ? "text-amber-500" :
                          order.order_status === "canceled" || order.order_status === "cancelled" ? "text-rose-500" :
                          "text-blue-500"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="canceled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-5 lg:py-6 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.payment_status === "paid" 
                          ? (isDark ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-50 text-emerald-600") 
                          : order.payment_status === "awaiting_confirmation" 
                            ? (isDark ? "bg-amber-900/50 text-amber-400" : "bg-amber-50 text-amber-600") 
                            : (isDark ? "bg-rose-900/50 text-rose-400" : "bg-rose-50 text-rose-600")
                      }`}>
                        {order.payment_status}
                      </div>
                      <div className={`flex items-center gap-1 text-[8px] font-bold uppercase italic ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                         <CreditCard className="w-2.5 h-2.5" />
                         Paystack
                      </div>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-5 lg:py-6">
                    <p className={`text-sm font-black ${isDark ? "text-white" : "text-gray-900"}`}>₦{order.total_amount.toLocaleString()}</p>
                  </td>
                  <td className="px-6 lg:px-8 py-5 lg:py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onSelectOrder(order.id)}
                        className={`p-2 rounded-xl transition-all ${
                          isDark ? "text-gray-400 hover:text-emerald-400 hover:bg-slate-600" : "text-gray-400 hover:text-[#0e4b31] hover:bg-green-50"
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { if(confirm("Discard order record?")) deleteOrder.mutate(order.id) }}
                        className={`p-2 rounded-xl transition-all ${
                          isDark ? "text-gray-400 hover:text-rose-400 hover:bg-slate-600" : "text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                        }`}
                        disabled={deleteOrder.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

