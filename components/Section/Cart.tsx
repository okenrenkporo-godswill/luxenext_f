"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from "@/hook/queries";

export default function DesktopCart() {
  const { items, setCart, clear } = useCartStore();
  const { data: cartData } = useCart();
  const updateCart = useUpdateCartItem();
  const removeCart = useRemoveCartItem();
  const clearCart = useClearCart();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const router = useRouter();
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Sync server cart
  useEffect(() => {
    if (cartData?.length) setCart(cartData);
  }, [cartData, setCart]);

  // Quantity handlers
  const handleIncrease = (item: any) => {
    const newQty = (item.quantity || 0) + 1;
    if (isLoggedIn && item.id) updateCart.mutate({ item_id: item.id, quantity: newQty });
    else setCart(items.map(i => i.product_id === item.product_id ? { ...i, quantity: newQty } : i));
  };

  const handleDecrease = (item: any) => {
    const newQty = (item.quantity || 0) - 1;
    if (newQty <= 0) return handleRemove(item);
    if (isLoggedIn && item.id) updateCart.mutate({ item_id: item.id, quantity: newQty });
    else setCart(items.map(i => i.product_id === item.product_id ? { ...i, quantity: newQty } : i));
  };

  // Remove single item
  const handleRemove = (item: any) => {
    if (isLoggedIn && item.id) {
      removeCart.mutate(item.id, { onSuccess: () => toast.success("Item removed") });
    } else {
      setCart(items.filter(i => i.product_id !== item.product_id));
      toast.success("Item removed");
    }
  };

  // Clear entire cart like mobile
  const handleClear = async () => {
    try {
      if (isLoggedIn) await clearCart.mutateAsync(); // clear server cart
      clear(); // clear local Zustand cart
      toast.success("Cart cleared!");
    } catch (err) {
      toast.error("Failed to clear cart");
    }
  };

  const toggleWishlist = (product_id: number) =>
    setWishlist(prev => prev.includes(product_id) ? prev.filter(id => id !== product_id) : [...prev, product_id]);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  if (!items.length) return <p className="text-center mt-10">Your cart is empty</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.product_id} className="flex items-center gap-4 border-b pb-4 relative hover:bg-gray-50 p-2 rounded-lg">
            <Image src={item.image || "/placeholder.png"} alt={item.name} width={80} height={80} className="rounded-lg" />
            <div className="flex-1 flex flex-col justify-between h-full">
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
              <div className="flex items-center gap-2 mt-1">
                <Button size="sm" variant="outline" onClick={() => handleDecrease(item)}>-</Button>
                <span>{item.quantity}</span>
                <Button size="sm" variant="outline" onClick={() => handleIncrease(item)}>+</Button>
              </div>
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => toggleWishlist(item.product_id)}>
                <Heart className={`w-5 h-5 ${wishlist.includes(item.product_id) ? "text-red-500" : "text-gray-400"}`} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleRemove(item)}>
                <Trash2 className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 flex flex-col gap-2">
        <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Shipping:</span><span>${shipping.toFixed(2)}</span></div>
        <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>${total.toFixed(2)}</span></div>

        <Button className="w-full mt-4" onClick={() => router.push("/checkout")}>Checkout</Button>
        <Button variant="destructive" className="w-full mt-2" onClick={handleClear}>Clear Cart</Button>
      </div>
    </div>
  );
}
