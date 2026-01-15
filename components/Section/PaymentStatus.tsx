"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, Truck, Package, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface OrderTrackerProps {
  orderStatus: string;
  paymentStatus: string;
}

// ... imports ...

const steps = [
  { id: 1, title: "Order Placed", icon: <Package className="w-5 h-5" /> },
  { id: 2, title: "Confirmed", icon: <CheckCircle className="w-5 h-5" /> },
  { id: 3, title: "Shipped", icon: <Truck className="w-5 h-5" /> }, // Renamed from "Processing" to "Shipped" for Jumia style
  { id: 4, title: "Delivered", icon: <CheckCircle className="w-5 h-5" /> }, // Renamed from "Completed"
];

export default function OrderTracker({ orderStatus, paymentStatus }: OrderTrackerProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Map backend status to UI steps
  useEffect(() => {
    switch (orderStatus.toLowerCase()) {
      case "pending":
      case "created":
        setCurrentStep(1);
        break;
      case "confirmed":
      case "awaiting_confirmation": // Grouping awaiting with confirmed/pending transition
        setCurrentStep(2);
        break;
      case "shipped":
      case "processing":
      case "in_transit":
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
    // ... existing cancelled view ...
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 bg-red-50 rounded-xl border border-red-100">
        <XCircle className="w-12 h-12 text-red-500 mb-3" />
        <p className="text-red-600 text-lg font-bold">Order Cancelled</p>
        <p className="text-gray-500 text-sm">
           This order has been cancelled.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex items-start justify-between relative">
        
        {/* Progress Line Background */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-0 rounded-full" />
        
        {/* Active Progress Line */}
        <motion.div 
            className="absolute top-5 left-0 h-1 bg-green-500 z-0 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const isCompleted = step.id <= currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10 w-1/4">
               {/* Step Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white shadow-md"
                    : "bg-white border-gray-300 text-gray-300"
                }`}
              >
                {step.id < currentStep ? (
                    <CheckCircle className="w-6 h-6" /> 
                ) : (
                    step.icon
                )}
              </motion.div>
              
              {/* Step Title */}
              <span
                className={`text-xs sm:text-sm mt-3 font-semibold text-center transition-colors duration-300 ${
                  isCompleted ? "text-green-700" : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
              
              {/* Time/Date Placeholder (Optional refinement) */}
              {isCurrent && (
                 <span className="text-[10px] text-gray-500 mt-1 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                    Current Step
                 </span>
              )}
            </div>
          );
        })}
      </div>

       {/* Optional: Detailed Status Message */}
       <div className="mt-8 text-center bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-green-800 font-medium text-sm">
             {currentStep === 1 && "We have received your order."}
             {currentStep === 2 && "Your order has been confirmed."}
             {currentStep === 3 && "Your order is being prepared/shipped."}
             {currentStep === 4 && "Your order has been delivered. Thank you!"}
          </p>
       </div>
    </div>
  );
}
