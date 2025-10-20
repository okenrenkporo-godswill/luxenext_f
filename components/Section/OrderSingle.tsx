"use client";

import Image from "next/image";
import { useOrder, useConfirmManualPayment, useRejectManualPayment } from "@/hook/queries";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchProductById } from "@/lib/api";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

interface OrderDetailProps {
  orderId: number;
  onBack: () => void;
}

export default function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const { data: order, isLoading, isError } = useOrder(orderId);
  const [productImages, setProductImages] = useState<{ [key: number]: string }>({});
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const confirmPayment = useConfirmManualPayment();
  const rejectPayment = useRejectManualPayment();

  // Fetch product images if missing
  useEffect(() => {
    if (!order) return;
    order.items.forEach(async (item) => {
      if (!item.image && !productImages[item.id]) {
        try {
          const product = await fetchProductById(item.product_id);
          setProductImages((prev) => ({
            ...prev,
            [item.id]: product.image_url || "/placeholder.png",
          }));
        } catch {
          setProductImages((prev) => ({
            ...prev,
            [item.id]: "/placeholder.png",
          }));
        }
      }
    });
  }, [order]);

  // Skeleton loader for order items
  if (isLoading)
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-4">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );

  if (isError || !order)
    return <p className="text-center mt-10 text-red-500">Order not found.</p>;

  const totalItems = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalPrice = order.items?.reduce((acc, item) => acc + item.quantity * item.price, 0) || 0;

  // Confirm payment handler
  const handleConfirmPayment = () => {
    confirmPayment.mutate(order.id, {
      onError: (err: any) => {
        const message = err?.response?.data?.detail || err?.message || "Something went wrong";
        toast.error(message);
      },
      onSuccess: () => {
        toast.success("Payment confirmed!");
      },
    });
  };

  // Reject payment handler
  const handleRejectPayment = () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a reason for rejection.");
      return;
    }
    rejectPayment.mutate(
      { order_id: order.id, reason: rejectReason },
      {
        onError: (err: any) => {
          const message = err?.response?.data?.detail || err?.message || "Something went wrong";
          toast.error(message);
        },
        onSuccess: () => {
          toast.success("Payment rejected!");
          setRejectModalOpen(false);
          setRejectReason("");
        },
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Button onClick={onBack} variant="outline" className="mb-4">
        ← Back to Orders
      </Button>

      <h2 className="text-3xl font-bold text-gray-800 mb-6">Order #{order.order_reference}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Products */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-black border-b pb-2 mb-4">Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 flex items-center gap-4">
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                          src={item.image || productImages[item.id] || "/placeholder.png"}
                          alt={item.product_name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <span className="font-medium text-gray-800">{item.product_name}</span>
                    </td>
                    <td className="py-3 px-4">₦{item.price.toLocaleString()}</td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4 font-semibold">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-100">
                  <td className="py-3 px-4 text-right" colSpan={2}>
                    Total:
                  </td>
                  <td className="py-3 px-4">{totalItems}</td>
                  <td className="py-3 px-4">₦{totalPrice.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Summary & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-2">
            <h3 className="text-xl font-bold text-black border-b pb-2 mb-3">Order Summary</h3>
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Total Items:</strong> {totalItems}
            </p>
            <p>
              <strong>Total Amount:</strong> ₦{totalPrice.toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> <span className="capitalize">{order.status}</span>
            </p>
            <p>
              <strong>Payment Status:</strong> <span className="capitalize">{order.payment_status}</span>
            </p>
            <p>
              <strong>Payment Method:</strong> {order.payment_method}
            </p>

            {order.payment_status === "awaiting_confirmation" && (
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={handleConfirmPayment}
                  disabled={confirmPayment.isPending}
                  variant="outline"
                >
                  Confirm Payment
                </Button>
                <Button
                  onClick={() => setRejectModalOpen(true)}
                  disabled={rejectPayment.isPending}
                  variant="destructive"
                >
                  Reject Payment
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Payment Modal */}
      {rejectModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onKeyDown={(e) => e.key === "Escape" && setRejectModalOpen(false)}
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 animate-fadeIn">
            <h3 className="text-xl font-bold">Reject Payment</h3>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Enter reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              disabled={rejectPayment.isPending}
            />
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectPayment}
                disabled={rejectPayment.isPending}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
