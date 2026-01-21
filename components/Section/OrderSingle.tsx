"use client";

import Image from "next/image";
import { useOrder, useConfirmManualPayment, useRejectManualPayment } from "@/hook/queries";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchProductById } from "@/lib/api";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Hash,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  User as UserIcon,
  Loader2
} from "lucide-react";

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

  useEffect(() => {
    if (!order) return;
    order.items.forEach(async (item) => {
      if (!item.image && !productImages[item.id]) {
        try {
          const product = await fetchProductById(item.product_id);
          setProductImages((prev) => ({ ...prev, [item.id]: product.image_url || "/placeholder.png" }));
        } catch {
          setProductImages((prev) => ({ ...prev, [item.id]: "/placeholder.png" }));
        }
      }
    });
  }, [order]);

  if (isLoading) return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-40 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-[400px] w-full rounded-3xl" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-[200px] w-full rounded-3xl" />
                <Skeleton className="h-[200px] w-full rounded-3xl" />
            </div>
        </div>
    </div>
  );

  if (isError || !order) return (
    <div className="p-12 text-center bg-rose-50 rounded-[2.5rem] border border-rose-100 flex flex-col items-center gap-4">
        <XCircle className="w-12 h-12 text-rose-500" />
        <p className="text-sm font-bold text-rose-600 uppercase tracking-widest italic">Order trace failed. Record might be missing.</p>
        <Button onClick={onBack} variant="outline" className="rounded-xl">Return to Terminal</Button>
    </div>
  );

  const totalPrice = order.items?.reduce((acc, item) => acc + item.quantity * item.price, 0) || 0;

  const handleConfirmPayment = () => {
    confirmPayment.mutate(order.id, {
      onError: (err: any) => toast.error(err?.response?.data?.detail || "System rejected confirmation"),
      onSuccess: () => toast.success("Transaction verified successfully"),
    });
  };

  const handleRejectPayment = () => {
    if (!rejectReason.trim()) return toast.error("Rejection reason is mandatory");
    rejectPayment.mutate({ order_id: order.id, reason: rejectReason }, {
      onError: (err: any) => toast.error(err?.response?.data?.detail || "Rejection logic failed"),
      onSuccess: () => {
        toast.success("Payment flagged as invalid");
        setRejectModalOpen(false);
      },
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm group transition-colors">
          <div className="p-2 rounded-xl group-hover:bg-gray-100 transition-colors"><ArrowLeft className="w-4 h-4" /></div>
          Back to Terminal
        </button>
        <div className="flex items-center gap-3">
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                order.payment_status === "paid" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            }`}>
               {order.payment_status}
            </div>
            <Button variant="outline" className="rounded-2xl gap-2 font-bold text-gray-600 border-gray-200">
                <ExternalLink className="w-4 h-4" />
                Export Invoice
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info Card */}
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
                <ShoppingBag className="w-64 h-64" />
             </div>
             <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-[#0e4b31] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-900/20"><Package className="w-7 h-7" /></div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 leading-tight">Order #{order.order_reference?.slice(-8)}</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            Placed on {new Date(order.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Cart Manifest</h3>
                    <div className="divide-y divide-gray-50 bg-gray-50/30 rounded-[2rem] border border-gray-50 overflow-hidden">
                        {order.items.map((item) => (
                          <div key={item.id} className="p-6 flex items-center gap-6 group hover:bg-white transition-colors">
                            <div className="w-20 h-20 relative flex-shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                <Image
                                  src={item.image || productImages[item.id] || "/placeholder.png"}
                                  alt={item.product_name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-base font-black text-gray-900 truncate">{item.product_name}</h4>
                                <p className="text-xs font-bold text-[#0e4b31] uppercase tracking-widest">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-gray-900">₦{item.price.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Subtotal: ₦{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Summary Card */}
          <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-900/10">
             <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Hash className="w-5 h-5 text-gray-500" />
                Financial Summary
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                    <span className="text-base font-bold text-gray-100">₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Shipping</span>
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Calculated at Hub</span>
                </div>
                <div className="pt-6">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Total Amount</p>
                    <div className="text-4xl font-black text-white">₦{totalPrice.toLocaleString()}</div>
                </div>
             </div>
             
             {order.payment_status === "awaiting_confirmation" && (
                <div className="grid grid-cols-1 gap-3 mt-10">
                    <Button onClick={handleConfirmPayment} disabled={confirmPayment.isPending} className="bg-[#0e4b31] hover:bg-[#0a3825] text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-green-900/20">
                        {confirmPayment.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        Approve Payment
                    </Button>
                    <Button onClick={() => setRejectModalOpen(true)} disabled={rejectPayment.isPending} variant="ghost" className="text-rose-400 hover:text-rose-500 hover:bg-white/5 rounded-2xl font-bold py-6">
                        Discard Receipt
                    </Button>
                </div>
             )}
          </div>

          {/* Logistics Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
             <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <UserIcon className="w-3.5 h-3.5" />
                    Customer Details
                </h4>
                <div className="space-y-1">
                    <p className="text-sm font-black text-gray-900 truncate">{order.user.name || "Legacy Account"}</p>
                    <p className="text-xs font-medium text-gray-500 truncate">{order.user.email}</p>
                </div>
             </div>
             <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    Dispatch Terminal
                </h4>
                <p className="text-xs font-medium text-gray-500 leading-relaxed italic">The routing engine maps this address to your nearest regional fulfillment center in Lagos.</p>
             </div>
             <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" />
                    Payment Channel
                </h4>
                <div className="px-4 py-3 bg-gray-50 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-black text-gray-900 uppercase">{order.payment_method}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Rejection Overlay */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="text-center mb-8">
                <div className="w-16 h-16 bg-rose-50 rounded-[1.5rem] flex items-center justify-center text-rose-500 mx-auto mb-4">
                  <XCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Flag Inconsistency</h3>
                <p className="text-sm text-gray-500 font-medium">Why is this transaction being rejected?</p>
             </div>
            <textarea
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-rose-200 transition-all font-medium h-32 resize-none text-sm mb-6"
              placeholder="e.g. Invalid receipt number, payment trace not found..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              disabled={rejectPayment.isPending}
            />
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setRejectModalOpen(false)} className="flex-1 py-4 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Abort</Button>
              <Button
                variant="destructive"
                onClick={handleRejectPayment}
                disabled={rejectPayment.isPending}
                className="flex-1 py-4 bg-rose-500 text-white rounded-[1.2rem] text-sm font-black shadow-lg shadow-rose-900/10 hover:bg-rose-600 transition-all"
              >
                {rejectPayment.isPending ? "Processing..." : "Confirm Reject"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
