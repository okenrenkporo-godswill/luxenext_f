"use client";

import { useState, useEffect } from "react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Trash2, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "@/hook/queries";

// Backend cart item may include `id`
type BackendCartItem = CartItem & { id?: number };

interface MobileCartProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MobileCart({ open, setOpen }: MobileCartProps) {
  const items = useCartStore((state) => state.items);
  const setCart = useCartStore((state) => state.setCart);
  const clear = useCartStore((state) => state.clear);

  const { data: cartData } = useCart();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const router = useRouter();

  const updateCartMutation = useUpdateCartItem();
  const removeCartMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  // Sync backend cart with local store
  useEffect(() => {
    if (cartData?.length) setCart(cartData);
  }, [cartData, setCart]);

  const handleIncrease = (item: BackendCartItem) => {
    const newQty = (item.quantity || 0) + 1;
    if (isLoggedIn && item.id) {
      updateCartMutation.mutate({ item_id: item.id, quantity: newQty });
    } else {
      setCart(
        items.map((i) =>
          i.product_id === item.product_id ? { ...i, quantity: newQty } : i
        )
      );
    }
  };

  const handleDecrease = (item: BackendCartItem) => {
    const newQty = (item.quantity || 0) - 1;
    if (newQty <= 0) return handleRemove(item);
    if (isLoggedIn && item.id) {
      updateCartMutation.mutate({ item_id: item.id, quantity: newQty });
    } else {
      setCart(
        items.map((i) =>
          i.product_id === item.product_id ? { ...i, quantity: newQty } : i
        )
      );
    }
  };

  const handleRemove = (item: BackendCartItem) => {
    if (isLoggedIn && item.id) {
      removeCartMutation.mutate(item.id, {
        onSuccess: () => toast.success("Item removed"),
      });
    } else {
      setCart(items.filter((i) => i.product_id !== item.product_id));
      toast.success("Item removed");
    }
  };

  const handleClear = async () => {
    try {
      if (isLoggedIn) await clearCartMutation.mutateAsync();
      clear();
      toast.success("Cart cleared!");
      setOpen(false);
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />

          {/* Cart Sidebar (Right Slide) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[85%] sm:w-[400px] bg-white dark:bg-gray-900 shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                Shopping Cart
                <span className="text-sm font-normal text-gray-500">({items.length})</span>
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpen(false)}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!items.length ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Package className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg">Your cart is empty</p>
                  <Button variant="link" onClick={() => setOpen(false)} className="text-green-600 mt-2">
                     Start Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product_id} className="flex gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      <Image 
                        src={item.image || "/placeholder.png"} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate pr-2">
                          {item.name}
                        </h3>
                        <p className="font-bold text-gray-900 dark:text-white">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg border px-1">
                          <button 
                            onClick={() => handleDecrease(item)}
                            className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-gray-100 rounded"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => handleIncrease(item)}
                            className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-gray-100 rounded"
                          >
                            +
                          </button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>₦{shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white pt-2 border-t">
                    <span>Total</span>
                    <span className="text-green-700">₦{total.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-200 text-red-500 hover:bg-red-50"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                  <Button 
                    className="flex-[2] bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-xl shadow-lg"
                    onClick={() => {
                      router.push("/checkout");
                      setOpen(false);
                    }}
                  >
                    CHECKOUT
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
