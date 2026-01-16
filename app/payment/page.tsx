"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const PaystackPayment = dynamic(() => import("@/components/Payment/PaystackPayment"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" />
    </div>
  ),
});

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <PaystackPayment />
    </Suspense>
  );
}
