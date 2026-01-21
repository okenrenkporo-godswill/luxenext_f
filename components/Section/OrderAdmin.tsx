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

export default function OrdersTable({ onSelectOrder }: { onSelectOrder: (id: number) => void }) {
  const { data: orders = [], isLoading, isError } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#0e4b31]" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fetching Orders...</p>
      </div>
    );

  if (isError)
    return (
      <div className="p-12 text-center bg-rose-50 rounded-[2rem] border border-rose-100 italic text-rose-500">
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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-sm text-gray-500">Monitor and fulfill your customer transactions</p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by ID or Ref..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#0e4b31]/10 transition-all font-medium"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-2xl">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-gray-500">Filter By Status</span>
            </div>
          </div>
          <button className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-colors ml-auto lg:ml-0">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Order Details</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Status / Fulfill</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Payment</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#0e4b31]/5 flex items-center justify-center text-[#0e4b31]">
                        <PackageCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">#{order.order_reference?.slice(-8) || order.id}</p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                           <Calendar className="w-3 h-3" />
                           {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-700">
                    <div className="min-w-[120px]">
                      <p className="truncate">{order.user.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium truncate">{order.user.email}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                       <select
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-widest border-none rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-[#0e4b31]/10 bg-gray-50 cursor-pointer ${
                          order.order_status === "delivered" ? "text-emerald-600" :
                          order.order_status === "pending" ? "text-amber-600" :
                          order.order_status === "canceled" || order.order_status === "cancelled" ? "text-rose-600" :
                          "text-blue-600"
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
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.payment_status === "paid" ? "bg-emerald-50 text-emerald-600" :
                        order.payment_status === "awaiting_confirmation" ? "bg-amber-50 text-amber-600" :
                        "bg-rose-50 text-rose-600"
                      }`}>
                        {order.payment_status}
                      </div>
                      <div className="flex items-center gap-1 text-[8px] text-gray-400 font-bold uppercase italic">
                         <CreditCard className="w-2.5 h-2.5" />
                         Paystack
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-gray-900">₦{order.total_amount.toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onSelectOrder(order.id)}
                        className="p-2 text-gray-400 hover:text-[#0e4b31] hover:bg-green-50 rounded-xl transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { if(confirm("Discard order record?")) deleteOrder.mutate(order.id) }}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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
