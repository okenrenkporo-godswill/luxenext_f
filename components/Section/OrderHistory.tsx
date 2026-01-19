"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useOrderHistory } from "@/hook/queries";
import {
  Loader2,
  Package,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderDetailsModal from "../MobileSection/MobileOrdetail";
import { useDeleteUserOrder } from "@/hook/queries";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function OrderHistoryDrawer({ open, setOpen }: Props) {
  const { data: orders, isLoading, isError } = useOrderHistory();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const deleteOrder = useDeleteUserOrder();

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleDeleteOrder = (id: number) => {
    if (confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      deleteOrder.mutate(id);
    }
  };

  return (
    <>
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerContent className="h-full w-[90vw] sm:w-[420px] fixed top-0 right-0 border-l shadow-lg bg-white/95 backdrop-blur-md rounded-none overflow-hidden transition-all">
          <DrawerHeader className="flex items-center justify-between border-b pb-3 bg-gradient-to-l from-green-900 to-white text-white">
            <DrawerTitle className="text-lg font-semibold">My Orders</DrawerTitle>
            <button onClick={() => setOpen(false)}>
              <XCircle className="w-6 h-6 text-white hover:text-red-300 transition" />
            </button>
          </DrawerHeader>

          <div className="p-4 max-h-[calc(100vh-80px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-16 text-gray-500">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Loading your orders...
              </div>
            ) : !orders || orders.length === 0 || isError ? (
              <div className="text-center py-20 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-60" />
                <p className="text-lg font-semibold">No orders yet</p>
                <p className="text-sm text-gray-400">
                  You haven’t placed any orders yet.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-5"
              >
                {orders.map((order: any, index: number) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 p-5 rounded-xl bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">
                          Ref:{" "}
                          <span className="font-medium text-gray-800">
                            {order.order_reference || "N/A"}
                          </span>
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          ₦{(order.total_amount || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1 items-end">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "cancelled" || order.status === "canceled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                            order.payment_status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        {order.status === "completed" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : order.status === "processing" ? (
                          <Truck className="w-4 h-4 text-yellow-600" />
                        ) : order.status === "cancelled" || order.status === "canceled" ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <Package className="w-4 h-4 text-gray-600" />
                        )}
                        {(order.items?.length || 0)} item(s)
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {(order.status === "pending" || order.status === "cancelled" || order.status === "canceled" || order.status === "failed") && (
                             <button 
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-2 text-red-400 hover:text-red-600 transition-colors"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                        )}
                        <Button
                            variant="link"
                            onClick={() => handleViewOrder(order)}
                            className="text-green-900 hover:text-green-700 font-medium h-auto p-0"
                        >
                            View →
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={modalOpen}
        setOpen={setModalOpen}
        order={selectedOrder}
      />
    </>
  );
}
