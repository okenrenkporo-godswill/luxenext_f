"use client";

import { useCartStore } from "@/store/useCartStore";
import Cart from "@/components/Section/Cart";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900 dark:to-green-950 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 dark:text-green-100">
            My Cart
          </h1>
          <p className="text-green-700 dark:text-green-300 mt-2 text-lg">
            {items.length > 0
              ? "Review your selected items before checkout"
              : "Your shopping bag is waiting for new goodies!"}
          </p>
        </div>

        {/* Cart Content */}
        {items.length > 0 ? (
          <Cart />
        ) : (
          <div className="flex flex-col items-center justify-center bg-white dark:bg-green-950 rounded-3xl shadow-2xl p-10 max-w-2xl mx-auto transition-all duration-300">
            {/* Empty Cart Image */}
            <div className="relative w-60 h-60 mb-6">
              <Image
                src="/empty.png" // 🖼️ place your image in /public/images/
                alt="Empty Cart"
                fill
                priority
                className="object-contain opacity-90"
              />
            </div>

            {/* Text Content */}
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-green-700 dark:text-green-300 text-center mb-8 max-w-sm">
              Looks like you haven’t added anything yet. Start exploring and discover great products!
            </p>

            {/* Button */}
            <Link href="/">
              <Button className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
