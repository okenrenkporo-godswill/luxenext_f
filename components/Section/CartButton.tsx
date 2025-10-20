"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/useCartStore";

export default function CartButton() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative">
      <Link href="/cart">
        <Button className="bg-white text-black border rounded-full cursor-pointer hover:bg-gray-100 flex items-center gap-1">
          <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
          Cart
        </Button>
      </Link>

      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </div>
  );
}
