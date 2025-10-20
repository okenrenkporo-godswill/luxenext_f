"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, Truck, Package, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface OrderTrackerProps {
  orderStatus: string;
  paymentStatus: string;
}

const steps = [
  { id: 1, title: "Pending", icon: <Clock className="w-6 h-6" /> },
  { id: 2, title: "Confirmed", icon: <CheckCircle className="w-6 h-6" /> },
  { id: 3, title: "Processing", icon: <Package className="w-6 h-6" /> },
  { id: 4, title: "Completed", icon: <Truck className="w-6 h-6" /> },
];

export default function OrderTracker({ orderStatus, paymentStatus }: OrderTrackerProps) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    switch (orderStatus.toLowerCase()) {
      case "pending":
        setCurrentStep(1);
        break;
      case "confirmed":
      case "awaiting_confirmation":
        setCurrentStep(2);
        break;
      case "processing":
        setCurrentStep(3);
        break;
      case "completed":
      case "delivered":
        setCurrentStep(4);
        break;
      case "cancelled":
        setCurrentStep(0);
        break;
      default:
        setCurrentStep(1);
    }
  }, [orderStatus]);

  if (orderStatus.toLowerCase() === "cancelled") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <XCircle className="w-12 h-12 text-red-500 mb-3" />
        <p className="text-red-600 text-lg font-semibold">Order Cancelled</p>
        <p className="text-gray-500 text-sm">
          Reason: payment was rejected or order cancelled
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Status</h2>

      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isActive = step.id <= currentStep;
          const isWaiting =
            step.id === 2 && paymentStatus.toLowerCase() === "awaiting_confirmation";

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isWaiting ? [1, 1.2, 1] : 1 }}
                transition={
                  isWaiting
                    ? { duration: 1, repeat: Infinity, repeatType: "loop" }
                    : { duration: 0.3 }
                }
                className={`flex items-center justify-center w-12 h-12 rounded-full border ${
                  isActive
                    ? isWaiting
                      ? "bg-yellow-400 text-white border-yellow-400"
                      : "bg-black text-white border-black"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {step.icon}
              </motion.div>
              <span
                className={`text-sm mt-2 font-medium ${
                  isActive ? (isWaiting ? "text-yellow-600" : "text-black") : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}

        {/* Progress line */}
        <div className="absolute top-6 left-[6%] right-[6%] h-1 bg-gray-200 z-0">
          <motion.div
            className="h-1 bg-black rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep - 1) * 33}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* Payment Info */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Payment Status:{" "}
          <span
            className={`font-semibold ${
              paymentStatus.toLowerCase() === "paid"
                ? "text-green-600"
                : paymentStatus.toLowerCase() === "rejected"
                ? "text-red-600"
                : paymentStatus.toLowerCase() === "awaiting_confirmation"
                ? "text-yellow-600"
                : "text-gray-600"
            }`}
          >
            {paymentStatus.toUpperCase()}
          </span>
        </p>
      </div>
    </div>
  );
}
