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
                  <Image src="/icons/paystack.svg" alt="Paystack" width={30} height={30} />
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
        <div className="grid gap-3">
          {methods.map((method) => (
            <motion.label
              key={method.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelect(method.id)}
              className={`border rounded-xl p-4 cursor-pointer transition-all flex justify-between items-center ${
                selected === method.id
                  ? "border-green-600 bg-green-50 shadow-sm"
                  : "border-gray-200 hover:border-green-400"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Optional provider icon */}
                {method.provider?.toLowerCase() === "paystack" && (
                  <Image src="/icons/paystack.svg" alt="Paystack" width={40} height={40} />
                )}
                {method.provider?.toLowerCase() === "flutterwave" && (
                  <Image src="/icons/flutterwave.svg" alt="Flutterwave" width={40} height={40} />
                )}

                <div>
                  <p className="font-bold text-gray-900">{method.name}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {method.provider}
                  </p>
                  {method.account_number && (
                    <p className="text-xs text-gray-400 mt-0.5">Account: {method.account_number}</p>
                  )}
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                 selected === method.id ? "border-green-600 bg-green-600" : "border-gray-300"
              }`}>
                 {selected === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </motion.label>
          ))}
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
