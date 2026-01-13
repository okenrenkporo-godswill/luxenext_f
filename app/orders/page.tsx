"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useOrderHistory } from "@/hook/queries";
import {
  Loader2,
  Package,
  CheckCircle,
  Truck,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderDetailsModal from "@/components/MobileSection/MobileOrdetail";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();
  const { data: orders, isLoading, isError } = useOrderHistory();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-2xl overflow-hidden p-6 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-24 text-gray-500">
              <Loader2 className="w-10 h-10 mb-4 animate-spin text-green-600" />
              <p>Fetching your orders...</p>
            </div>
          ) : !orders || orders.length === 0 || isError ? (
            <div className="text-center py-24 text-gray-500">
              <Package className="w-20 h-20 mx-auto mb-6 opacity-20" />
              <h2 className="text-xl font-semibold text-gray-700">No orders found</h2>
              <p className="text-gray-400 mt-2 mb-8">
                You haven't placed any orders yet. Start shopping to see them here!
              </p>
              <Button 
                  onClick={() => router.push("/")}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-2 rounded-full shadow-lg"
              >
                Go Shopping
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6"
            >
              {orders.map((order: any, index: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative border border-gray-100 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Order Ref</span>
                        <p className="text-lg font-mono font-semibold text-gray-900">
                          #{order.order_reference || "N/A"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                          order.payment_status === "paid"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Package className="w-4 h-4" />
                          <span>{order.items?.length || 0} item(s)</span>
                       </div>
                       <p className="text-lg font-bold text-gray-900">
                         ₦{(order.total_amount || 0).toLocaleString()}
                       </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleViewOrder(order)}
                      className="border-green-600 text-green-700 hover:bg-green-50 rounded-full px-6"
                    >
                      View
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={modalOpen}
        setOpen={setModalOpen}
        order={selectedOrder}
      />
    </div>
  );
}
