"use client";

import { useState, useEffect } from "react";

import { Search, ShoppingCart, Sun, Moon, MenuIcon, User, LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import AccountDropdown from "../Section/AccountDropdown";
import SearchBar from "../Section/Search";
import CartButton from "../Section/CartButton";

export default function MobileHeader() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-16 bg-white w-full animate-pulse" />;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left: Menu Toggle */}
        <button className="p-2">
            <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>

        {/* Center: Logo */}
        <div 
          className="flex-1 text-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <span className="text-xl font-bold text-green-700">LuxeNext</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <AccountDropdown />
          <CartButton />
        </div>
      </div>

      {/* Full width search bar below top row */}
      <div className="px-4 pb-3">
        <SearchBar />
      </div>
    </header>
  );
}
