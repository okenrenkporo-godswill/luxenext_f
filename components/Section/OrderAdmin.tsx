"use client";

import { useAdminOrders, useUpdateOrderStatus, useDeleteOrder } from "@/hook/queries";
import { Loader2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OrdersTable({ onSelectOrder }: { onSelectOrder: (id: number) => void }) {
  const { data: orders, isLoading, isError } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );

  if (isError)
    return (
      <p className="text-center text-red-500">Failed to fetch orders. Try again later.</p>
    );

  if (!orders || orders.length === 0)
    return <p className="text-center text-gray-400 mt-10">No orders found.</p>;

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatus.mutate(
      {
        order_id: id,
        data: { status: newStatus as "pending" | "processing" | "shipped" | "delivered" | "canceled" },
      },
      {
        onSuccess: () => toast.success("Order status updated successfully"),
        onError: () => toast.error("Failed to update order status"),
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteOrder.mutate(id, {
      onSuccess: () => toast.success("Order deleted successfully"),
      onError: () => toast.error("Failed to delete order"),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">All Orders</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left bg-gray-100 text-gray-600 uppercase text-xs">
              <th className="p-3">#</th>
              <th className="p-3">User</th>
              <th className="p-3">Order Ref</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium">{order.user.name}</td>
                <td className="p-3">{order.order_reference}</td>
                <td className="p-3">
                  <select
                    value={order.order_status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="canceled">Cancelled</option>
                  </select>
                </td>
                <td className="p-3 capitalize">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      order.payment_status === "paid"
                        ? "bg-green-100 text-green-600"
                        : order.payment_status === "awaiting_confirmation"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </td>
                <td className="p-3 font-semibold text-gray-700">
                  ₦{order.total_amount.toLocaleString()}
                </td>
                <td className="p-3 text-gray-500 text-xs">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-right flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectOrder(order.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(order.id)}
                    disabled={deleteOrder.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
