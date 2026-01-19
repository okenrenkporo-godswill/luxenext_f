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

import MobileCart from "./MobileCart";

export default function MobileHeader() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isOpen = useCartStore((state) => state.isOpen);
  const setOpen = useCartStore((state) => state.setOpen);

  const cartCount = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-16 bg-white w-full animate-pulse" />;

  return (
    <header className="sticky top-0 z-50 bg-[#0e4b31] border-b border-white/5 shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between px-5 h-16">
        {/* Left: Branding */}
        <div 
          className="flex flex-row items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-10 h-10 bg-[#0e4b31] rounded-xl flex items-center justify-center shadow-lg border border-white/20">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
            </svg>
          </div>
          <span className="text-xl font-serif italic text-white tracking-tight">Luxenext</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="text-white">
            <AccountDropdown />
          </div>
          
          <button 
            onClick={() => setOpen(true)}
            className="relative p-2 rounded-full bg-white/10 hover:bg-white/15 transition-all"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#0e4b31]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Full width search bar wrapper */}
      <div className="px-5 pb-3.5">
        <SearchBar />
      </div>

      {/* Cart Drawer */}
      <MobileCart open={isOpen} setOpen={setOpen} />
    </header>
  );
}
