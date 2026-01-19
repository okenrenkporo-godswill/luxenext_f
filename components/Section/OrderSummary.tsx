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
              <div className="space-y-4">
                 {/* Group Items by Delivery Option (Simulation) */}
                 <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/30">
                     <h3 className="font-bold text-sm text-green-700 mb-3 uppercase tracking-wide">Delivery 1 of 1</h3>
                     <div className="divide-y divide-gray-100">
                        {items.map((item) => (
                           <div key={item.product_id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                              <div className="relative w-20 h-20 flex-shrink-0 border rounded-lg bg-white p-1">
                                 {item.image ? (
                                    <Image src={item.image} alt={item.name} fill className="object-contain rounded-md" />
                                 ) : (
                                    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">No Img</div>
                                 )}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug">{item.name}</p>
                                 <p className="text-xs text-green-600 mt-1 font-medium">In Stock</p>
                                 <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                                 <p className="font-bold text-gray-900 mt-2">₦{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                 </div>
 
                 {/* Order Totals */}
                 <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                       <span>Subtotal ({items.length} items)</span>
                       <span>₦{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                       <span>Shipping</span>
                       <span className="text-green-600 font-medium">Free</span>
                    </div>
                     <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-gray-200 mt-2 text-gray-900">
                       <span>Order Total</span>
                       <span className="text-red-700">₦{total.toLocaleString()}</span>
                    </div>
                 </div>

                 <Button
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-12 rounded-lg shadow-sm"
                  >
                    {isProcessing ? (
                       <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                       "Place Your Order"
                    )}
                  </Button>
                   <div className="text-center">
                     <Button variant="link" onClick={onBack} className="text-sm text-blue-600 hover:underline p-0 h-auto">
                        Back to Payment
                     </Button>
                  </div>
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
