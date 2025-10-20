"use client";

import { useState, useEffect } from "react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Heart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "@/hook/queries";

// Extend CartItem to include backend id
type BackendCartItem = CartItem & { id?: number };

interface MobileCartProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MobileCart({ open, setOpen }: MobileCartProps) {
  // ✅ Zustand selectors
  const items = useCartStore((state) => state.items);
  const setCart = useCartStore((state) => state.setCart);
  const clear = useCartStore((state) => state.clear);

  const { data: cartData } = useCart();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const router = useRouter();

  const updateCartMutation = useUpdateCartItem();
  const removeCartMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const [wishlist, setWishlist] = useState<number[]>([]);

  // Sync backend cart with local Zustand store
  useEffect(() => {
    if (cartData?.length) setCart(cartData);
  }, [cartData, setCart]);

  // Quantity handlers
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

  // Remove single item
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

  // Clear entire cart
  const handleClear = async () => {
    try {
      if (isLoggedIn) await clearCartMutation.mutateAsync();
      clear(); // Zustand local cart
      toast.success("Cart cleared!");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to clear cart");
    }
  };

  // Wishlist toggle
  const toggleWishlist = (product_id: number) =>
    setWishlist((prev) =>
      prev.includes(product_id)
        ? prev.filter((id) => id !== product_id)
        : [...prev, product_id]
    );

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl p-4 flex flex-col z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Cart</h2>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {!items.length ? (
              <p className="text-center mt-10">Your cart is empty</p>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center gap-3 border-b p-2 rounded-lg relative hover:bg-gray-50"
                  >
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-lg"
                    />
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDecrease(item)}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleIncrease(item)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleWishlist(item.product_id)}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            wishlist.includes(item.product_id)
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemove(item)}
                      >
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={() => {
                    router.push("/checkout");
                    setOpen(false);
                  }}
                >
                  Checkout
                </Button>
                <Button
                  variant="destructive"
                  className="w-full mt-2"
                  onClick={handleClear}
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
