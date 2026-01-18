"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePaymentMethods } from "@/hook/queries";

interface StepPaymentProps {
  onNext: () => void;
  onBack: () => void;
  collapsed?: boolean;
  onEdit?: () => void;
}

export default function StepPayment({ onNext, onBack, collapsed = false, onEdit }: StepPaymentProps) {
  const { data: methods, isLoading } = usePaymentMethods();
  const [selected, setSelected] = useState<number | null>(null);

  // Load previously selected payment method from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selectedPaymentId");
    if (saved) setSelected(Number(saved));
  }, []);

  const handleSelect = (id: number) => {
    setSelected(id);
    localStorage.setItem("selectedPaymentId", String(id));
  };

  const handleContinue = () => {
    if (!selected) {
      toast.error("Please select a payment method");
      return;
    }
    onNext();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-20">
        <Loader2 className="animate-spin text-gray-400 w-5 h-5" />
      </div>
    );
  }

  // --- COLLAPSED VIEW (Summary) ---
  if (collapsed) {
    const selectedMethod = methods?.find((m) => m.id === selected);
    return (
      <div className="flex items-start justify-between">
         {selectedMethod ? (
            <div className="flex items-center gap-4">
              {selectedMethod.provider?.toLowerCase() === "paystack" && (
                  <Image src="/paystack.jpg" alt="Paystack" width={30} height={30} />
              )}
               <div>
                  <p className="font-bold text-gray-800 text-sm">{selectedMethod.name}</p>
                  <p className="text-xs text-gray-500">Provider: {selectedMethod.provider}</p>
               </div>
            </div>
         ) : (
            <p className="text-sm text-red-500">No payment method selected.</p>
         )}

         {onEdit && (
          <Button variant="link" onClick={onEdit} className="text-green-700 font-semibold p-0 h-auto">
            Change
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-base font-medium text-gray-500">Select Payment Method</h2>

      {methods && methods.length > 0 ? (
        <div className="flex flex-col gap-3">
          {/* Filter for OPay or Account Number ending with 09 */}
          {methods.filter(m => (m.provider?.toLowerCase().includes("opay") || m.name?.toLowerCase().includes("transfer")) && m.account_number?.endsWith("09")).map((method) => (
            <motion.label
              key={method.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(method.id)}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all flex items-start gap-3 ${
                selected === method.id
                  ? "border-green-600 bg-green-50/50 ring-1 ring-green-600"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
               <div className="mt-1">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                     selected === method.id ? "border-green-600 bg-green-600" : "border-gray-400 bg-white"
                  }`}>
                     {selected === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
               </div>

               <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                     <p className="font-bold text-gray-900 text-base">Bank Transfer</p>
                     <Image src="/icons/opay.png" alt="OPay" width={24} height={24} className="opacity-80 rounded-sm" /> 
                  </div>
                  
                  <p className="text-sm text-gray-700">
                     Pay to <span className="font-semibold">OPay</span>
                  </p>
                  {method.account_number && (
                    <p className="text-sm text-gray-600 mt-1 bg-gray-100/80 inline-block px-2 py-1 rounded border border-gray-200 font-mono">
                       {method.account_number}
                    </p>
                  )}
                  <p className="text-xs text-green-600 mt-2 font-medium">
                     Make a transfer to this account to complete your order.
                  </p>
               </div>
            </motion.label>
          ))}

          {/* Paystack Suggestion */}
           <div className="mt-4 border-t border-gray-100 pt-4">
               <p className="text-sm font-semibold text-gray-800 mb-2">Other Payment Options</p>
               <div 
                 className="border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors" 
                 onClick={() => {
                     // Try to find Paystack by provider OR name (case-insensitive)
                     const paystackMethod = methods.find(m => 
                        m.provider?.toLowerCase().includes("paystack") || 
                        m.name?.toLowerCase().includes("paystack") ||
                        m.name?.toLowerCase().includes("card")
                     );

                     if (paystackMethod) {
                        handleSelect(paystackMethod.id);
                        toast.success("Paystack selected. Click 'Use this payment method' to proceed.");
                     } else {
                         // Fallback: If no dedicated Paystack method exists, warn the user.
                         // This is crucial during integration if the backend data isn't set up yet.
                        toast.error("Paystack payment method not found in system configuration. Please check Admin settings.");
                        console.error("Available methods:", methods);
                     }
                  }}
               >
                 <div className="flex items-center gap-3">
                     <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                         (() => {
                            const paystackMethod = methods.find(m => 
                                m.provider?.toLowerCase().includes("paystack") || 
                                m.name?.toLowerCase().includes("paystack") ||
                                m.name?.toLowerCase().includes("card")
                            );
                            return paystackMethod?.id === selected;
                         })()
                        ? "border-green-600 bg-green-600" 
                        : "border-gray-300 bg-white"
                    }`}>
                        {(() => {
                           const paystackMethod = methods.find(m => 
                                m.provider?.toLowerCase().includes("paystack") || 
                                m.name?.toLowerCase().includes("paystack") ||
                                m.name?.toLowerCase().includes("card")
                            );
                           return paystackMethod?.id === selected;
                        })() && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">Pay with Card</span>
                        <span className="text-xs text-gray-500">Secured by Paystack</span>
                    </div>
                 </div>
                 <Image src="/paystack.jpg" alt="Paystack" width={20} height={20} className="grayscale opacity-60" />
               </div>
           </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6 border rounded-xl border-dashed">
          <p>No payment methods available.</p>
          <p className="text-xs mt-1">
            Please contact support or add one in your profile.
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-gray-100">
        <Button onClick={handleContinue} disabled={isLoading} className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow-sm">
          Use this payment method
        </Button>
      </div>
    </div>
  );
}
