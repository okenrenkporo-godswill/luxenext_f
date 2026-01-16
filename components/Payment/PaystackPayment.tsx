"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useOrder } from "@/hook/queries";
import { usePaystackPayment } from "react-paystack";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function PaystackPayment() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const { data: order, isLoading, error } = useOrder(id ? Number(id) : null);

  const config = {
    reference: order?.order_reference || new Date().getTime().toString(),
    email: order?.user?.email || "",
    amount: order ? Math.round(order.total_amount * 100) : 0, // Amount is in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    toast.success("Payment successful! Reference: " + reference.reference);
    router.push("/orders"); 
  };

  const onClose = () => {
    toast.info("Payment cancelled.");
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h1 className="text-xl font-bold">Order Not Found</h1>
        <p className="text-gray-500">We couldn't find the order you're looking for.</p>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }

  if (order.payment_status === "paid") {
      return (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-bold">Payment Successful</h1>
            <p className="text-gray-500">This order has already been paid for.</p>
            <Button onClick={() => router.push("/orders")}>View Orders</Button>
        </div>
      )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
           <Image src="/icons/paystack.svg" alt="Paystack" width={120} height={40} />
        </div>
        
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">Complete Payment</h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Order #{order.order_reference}
        </p>

        <div className="mb-8 space-y-4 rounded-xl bg-gray-50 p-4">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600">Customer</span>
            <span className="font-medium text-gray-900">{order.user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount to Pay</span>
            <span className="text-lg font-bold text-green-700">
              ₦{order.total_amount.toLocaleString()}
            </span>
          </div>
        </div>

        <Button
          className="w-full bg-green-600 py-6 text-lg font-bold hover:bg-green-700"
          onClick={() => {
              initializePayment({onSuccess, onClose})
          }}
        >
          Pay Now
        </Button>

        <p className="mt-6 text-center text-xs text-gray-400">
          Secured by Paystack. Your card details are safe.
        </p>

        <div className="mt-4 text-center">
            <Button variant="link" onClick={() => router.back()} className="text-gray-500">
                Cancel
            </Button>
        </div>
      </div>
    </div>
  );
}
