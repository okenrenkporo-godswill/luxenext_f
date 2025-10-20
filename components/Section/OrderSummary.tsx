"use client";

import { Button } from "@/components/ui/button";
import { useCheckout, useOrder } from "@/hook/queries";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import OrderTracker from "./PaymentStatus";
import { Loader2 } from "lucide-react"; // Spinner icon

interface StepSummaryProps {
  onBack: () => void;
}

export default function StepSummary({ onBack }: StepSummaryProps) {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const checkoutMutation = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false); // ✅ Local loading state
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const { data: order } = useOrder(createdOrderId);

  const address_id = Number(localStorage.getItem("selectedAddressId"));
  const payment_method_id = Number(localStorage.getItem("selectedPaymentId"));

  const handleConfirmOrder = async () => {
    if (!address_id || !payment_method_id) {
      toast.error("Please select both address and payment method first.");
      return;
    }

    setIsProcessing(true); // ✅ Start spinner
    try {
      const orderResponse = await checkoutMutation.mutateAsync({ address_id, payment_method_id });
      toast.success("🎉 Order placed successfully!");
      setCreatedOrderId(orderResponse.id);

      clearCart();
      localStorage.removeItem("selectedAddressId");
      localStorage.removeItem("selectedPaymentId");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to create order");
    } finally {
      setIsProcessing(false); // ✅ Stop spinner
    }
  };

  const isOrderPlaced = !!createdOrderId;
  const isPaymentConfirmed = order?.payment_status === "paid";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border rounded-2xl shadow-md p-8 w-full max-w-2xl mx-auto"
    >
      {!isOrderPlaced ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Order Summary
          </h2>

          {items.length > 0 ? (
            <>
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover border"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center font-semibold text-lg mt-6 border-t pt-4">
                <span>Total</span>
                <span className="text-black">${total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mt-8 gap-4">
                <Button variant="outline" onClick={onBack} className="w-1/2 hover:bg-gray-100">
                  Go Back
                </Button>

                <Button
                  onClick={handleConfirmOrder}
                  disabled={isProcessing} // ✅ disable while processing
                  className="w-1/2 bg-black text-white hover:bg-gray-800 flex justify-center items-center gap-2"
                >
                  {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isProcessing ? "Processing..." : "Confirm Order"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-16">
              <Image
                src="/empty-cart.svg"
                alt="Empty cart"
                width={120}
                height={120}
                className="mx-auto mb-4 opacity-80"
              />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add some products to continue checkout</p>
              <Button onClick={onBack} variant="outline" className="mt-6 text-sm hover:bg-gray-100">
                Return to Shop
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          {!isPaymentConfirmed ? (
            <OrderTracker
              orderStatus={order?.status || "pending"}
              paymentStatus={order?.payment_status || "awaiting_confirmation"}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16"
            >
              <Image
                src="/thank.jpg"
                alt="Thank you"
                width={150}
                height={150}
                className="mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Thank You for Shopping with Us! 🎉
              </h2>
              <p className="text-gray-600 mb-4">
                Your order has been confirmed. Check your email to see the status of your transaction.
              </p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="mt-4 bg-black text-white hover:bg-gray-800"
              >
                Continue Shopping
              </Button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
