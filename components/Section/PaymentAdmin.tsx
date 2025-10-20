"use client";

import React, { useState } from "react";
import { useConfirmManualPayment, useRejectManualPayment, useAdminOrder } from "@/hook/queries";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentActionsProps {
  orderId: number;
  className?: string;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({ orderId, className }) => {
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  // Poll every 3 seconds while payment is pending
  const { data: order, isFetching, refetch } = useAdminOrder(orderId);

  const confirmMutation = useConfirmManualPayment();
  const rejectMutation = useRejectManualPayment();

  const handleConfirm = async () => {
    try {
      setLoadingConfirm(true);
      await confirmMutation.mutateAsync(orderId);
      toast.success("Payment confirmed successfully!");
      await refetch(); // update order immediately
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to confirm payment");
    } finally {
      setLoadingConfirm(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Enter reason for rejecting payment:");
    if (!reason) return;

    try {
      setLoadingReject(true);
      await rejectMutation.mutateAsync({ order_id: orderId, reason });
      toast.success("Payment rejected successfully!");
      await refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to reject payment");
    } finally {
      setLoadingReject(false);
    }
  };

  // Disable buttons if payment already finalized
  const isFinalized = order?.payment_status === "confirmed" || order?.payment_status === "rejected";

  return (
    <div className={`flex gap-2 items-center ${className || ""}`}>
      <Button onClick={handleConfirm} disabled={loadingConfirm || isFinalized}>
        {loadingConfirm ? "Confirming..." : "Confirm Payment"}
      </Button>
      <Button onClick={handleReject} disabled={loadingReject || isFinalized} variant="destructive">
        {loadingReject ? "Rejecting..." : "Reject Payment"}
      </Button>
      {order && (
        <span className="ml-2 font-medium">
          Status: {isFetching ? "Updating..." : order.payment_status}
        </span>
      )}
    </div>
  );
};

export default PaymentActions;
