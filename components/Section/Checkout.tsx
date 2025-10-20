"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepAddress from "./Adress";
import StepPayment from "./Payment";
import StepSummary from "./OrderSummary";


export default function CheckoutFlow() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8 text-gray-600 text-sm uppercase tracking-wider">
        <span className={step === 1 ? "font-bold text-black" : ""}>Shipping</span>
        <span className={step === 2 ? "font-bold text-black" : ""}>Payment</span>
        <span className={step === 3 ? "font-bold text-black" : ""}>Summary</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="address"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <StepAddress onNext={next} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <StepPayment onNext={next} onBack={back} />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <StepSummary onBack={back} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
