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
      <DialogContent className="max-w-md mx-auto rounded-2xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Order Details
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Ref:</span>{" "}
              {order.order_reference || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Amount:</span> ₦
              {order.total_amount?.toLocaleString() || "0"}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Status:</span>{" "}
              <span
                className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                  order.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : order.status === "processing"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Payment:</span>{" "}
              <span
                className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                  order.payment_status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.payment_status}
              </span>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Items
            </h3>
            <div className="space-y-3">
              {order.items?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-700">{item.product_name}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    x{item.quantity} — ₦
                    {item.price?.toLocaleString() || "0"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <DialogClose asChild>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Close
              </button>
            </DialogClose>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
