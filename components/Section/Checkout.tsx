"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepAddress from "./Adress";
import StepPayment from "./Payment";
import StepSummary from "./OrderSummary";
import { CheckCircle2 } from "lucide-react";


export default function CheckoutFlow() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);
  const goToStep = (s: number) => setStep(s);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-8">Checkout ({step === 3 ? "Review" : "Details"})</h1>

      <div className="space-y-6">
        
        {/* STEP 1: ADDRESS */}
        <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${step === 1 ? "border-green-600 bg-white shadow-md" : "border-gray-200 bg-gray-50/50"}`}>
            <div className={`p-4 flex items-center justify-between cursor-pointer ${step !== 1 ? "hover:bg-gray-50" : ""}`} onClick={() => step > 1 && goToStep(1)}>
               <h2 className={`font-bold flex items-center gap-2 ${step > 1 ? "text-green-700" : "text-lg text-gray-900"}`}>
                  1. Shipping Address
                  {step > 1 && <CheckCircle2 className="w-5 h-5 text-green-600" />}
               </h2>
            </div>
            
            <AnimatePresence initial={false}>
               {/* Content always rendered but style changes based on step */}
               <div className={`px-6 pb-6 ${step === 1 ? "block" : "block pt-0"}`}>
                   <StepAddress 
                      onNext={next} 
                      collapsed={step !== 1} 
                      onEdit={() => goToStep(1)}
                    />
               </div>
            </AnimatePresence>
        </div>


        {/* STEP 2: PAYMENT */}
        <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${step === 2 ? "border-green-600 bg-white shadow-md z-10 relative" : "border-gray-200 bg-gray-50/50"}`}>
           <div className={`p-4 flex items-center justify-between ${step > 2 ? "cursor-pointer hover:bg-gray-50" : ""}`} onClick={() => step > 2 && goToStep(2)}>
               <h2 className={`font-bold flex items-center gap-2 ${step < 2 ? "text-gray-400" : step > 2 ? "text-green-700" : "text-lg text-gray-900"}`}>
                  2. Payment Method
                   {step > 2 && <CheckCircle2 className="w-5 h-5 text-green-600" />}
               </h2>
           </div>

           <AnimatePresence initial={false}>
             {step >= 2 && (
               <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: "auto", opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 transition={{ duration: 0.3 }}
               >
                 <div className="px-6 pb-6">
                    <StepPayment 
                        onNext={next} 
                        onBack={back} 
                        collapsed={step !== 2}
                        onEdit={() => goToStep(2)}
                    />
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>


        {/* STEP 3: SUMMARY */}
        <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${step === 3 ? "border-green-600 bg-white shadow-md" : "border-gray-200 bg-gray-50/50"}`}>
           <div className="p-4">
               <h2 className={`font-bold ${step < 3 ? "text-gray-400" : "text-lg text-gray-900"}`}>
                  3. Items and Shipping
               </h2>
           </div>

           <AnimatePresence initial={false}>
             {step === 3 && (
               <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: "auto", opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 transition={{ duration: 0.3 }}
               >
                 <div className="px-6 pb-6">
                    <StepSummary onBack={() => goToStep(2)} />
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
