"use client";

import { useState, useEffect } from "react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Heart, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "@/hook/queries";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

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

  const [wishlist, setWishlist] = useState<number[]>([]);

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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="max-h-[85vh] p-0 flex flex-col bg-white dark:bg-gray-900 border-t-2 rounded-t-3xl">
        <DrawerHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-bold flex items-center gap-2">
              My Shopping Cart
              <span className="text-sm font-normal text-gray-500">
                ({items.length} items)
              </span>
            </DrawerTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full">
               <X className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {!items.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-10 h-10" />
               </div>
               <p className="text-lg font-medium">Your cart is empty</p>
               <Button variant="link" onClick={() => setOpen(false)} className="text-green-600 mt-2">
                  Start shopping now
               </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 group hover:bg-gray-100 transition-colors"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start gap-1">
                       <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate pr-2">
                         {item.name}
                       </h3>
                       <p className="font-bold text-gray-900 dark:text-white flex-shrink-0">
                         ₦{(item.price * item.quantity).toLocaleString()}
                       </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                       <div className="flex items-center bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 px-1 py-0.5 shadow-sm">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7 rounded-full text-indigo-600"
                            onClick={() => handleDecrease(item)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7 rounded-full text-indigo-600"
                            onClick={() => handleIncrease(item)}
                          >
                            +
                          </Button>
                       </div>

                       <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 text-red-500 hover:bg-red-50"
                            onClick={() => handleRemove(item)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600 py-1">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 py-1 border-b pb-2 border-gray-50">
                <span>Shipping Fee</span>
                <span className="font-medium text-gray-900">₦{shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-lg font-bold text-gray-800">Total Amount</span>
                <span className="text-xl font-extrabold text-green-700">₦{total.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
               <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-500 hover:bg-red-50"
                  onClick={handleClear}
               >
                  Clear Cart
               </Button>
               <Button
                  className="flex-[2] bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl text-lg shadow-lg active:scale-95 transition-transform"
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
      </DrawerContent>
    </Drawer>
  );
}
