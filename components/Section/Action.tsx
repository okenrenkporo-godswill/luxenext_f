"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  UserIcon,
  ShoppingCartIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";

export default function Action({
  darkMode,
  toggleDarkMode,
  menuOpen,
  setMenuOpen,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
  menuOpen?: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex items-center gap-4">
      {/* Account Button (Login/Register) */}
      <Link href="/login">
        <Button className="bg-white text-black border rounded-full cursor-pointer hover:bg-gray-100 flex items-center gap-1">
          <UserIcon className="w-5 h-5 text-gray-700" />
          Account
        </Button>
      </Link>

      {/* Cart */}
      <Link href="/cart" className="relative">
        <Button className="bg-white text-black border rounded-full cursor-pointer hover:bg-gray-100 flex items-center gap-1">
          <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
          Cart
        </Button>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>

      <BellIcon className="w-5 h-5 text-gray-700 cursor-pointer" />

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        {darkMode ? (
          <SunIcon className="w-5 h-5 text-yellow-400" />
        ) : (
          <MoonIcon className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {menuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      </button>
    </div>
  );
}
