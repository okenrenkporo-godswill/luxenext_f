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
}

export default function StepPayment({ onNext, onBack }: StepPaymentProps) {
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
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-8">
      <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>

      {methods && methods.length > 0 ? (
        <div className="grid gap-3">
          {methods.map((method) => (
            <motion.label
              key={method.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(method.id)}
              className={`border rounded-xl p-4 cursor-pointer transition-all flex justify-between items-center ${
                selected === method.id
                  ? "border-black bg-gray-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
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
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    Provider: {method.provider}
                  </p>
                  {method.account_number && (
                    <p className="text-sm text-gray-400">Account: {method.account_number}</p>
                  )}
                </div>
              </div>

              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selected === method.id}
                readOnly
                className="w-4 h-4 accent-black"
              />
            </motion.label>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6 border rounded-xl">
          <p>No payment methods available.</p>
          <p className="text-sm mt-2">
            Please contact support or add one in your profile.
          </p>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Go Back
        </Button>
        <Button onClick={handleContinue} disabled={isLoading}>
          Continue
        </Button>
      </div>
    </div>
  );
}
