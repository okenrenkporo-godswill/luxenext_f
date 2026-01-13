"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

interface OrderDetailsModalProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  order: any; // you can replace `any` with your order type later
}

export default function OrderDetailsModal({
  open,
  setOpen,
  order,
}: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl mx-auto rounded-3xl p-0 bg-white overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-gradient-to-r from-green-900 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Order Details
            </DialogTitle>
            <span className="text-green-100 text-sm font-medium">#{order.order_reference}</span>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8 space-y-8"
        >
          {/* Order Meta Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Order Information</h3>
              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Reference:</span>
                    <span className="text-sm font-bold text-gray-800">{order.order_reference || "N/A"}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Placed on:</span>
                    <span className="text-sm font-bold text-gray-800">{new Date(order.created_at).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-base font-bold text-gray-900">Total Amount:</span>
                    <span className="text-lg font-black text-green-700">₦{order.total_amount?.toLocaleString() || "0"}</span>
                 </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Status Details</h3>
               <div className="space-y-3">
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Shipment:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Payment:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        order.payment_status === "paid"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {order.payment_status}
                    </span>
                 </div>
               </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
               <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  Order Items ({order.items?.length || 0})
               </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group relative">
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Package className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.product_name}</p>
                      <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">₦{item.price?.toLocaleString() || "0"}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Subtotal: ₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <DialogClose asChild>
              <button className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-bold text-sm shadow-lg shadow-black/10">
                Close
              </button>
            </DialogClose>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
