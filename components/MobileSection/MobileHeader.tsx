"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, Sun, Moon, LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import MobileCart from "./MobileCart";
import MobileSearch from "./MobileSearch";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";

const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
};

export default function MobileHeader() {
  const router = useRouter();
  const hydrated = useHydrated();
  const auth = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const cartCount = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark", !darkMode);
    localStorage.setItem("darkMode", (!darkMode).toString());
  };

  // Load dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  if (!hydrated) return null; // prevent SSR mismatch

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 left-0 w-full flex items-center justify-between px-4 h-16 z-50 transition-all duration-300 backdrop-blur-md",
          scrolled
            ? "bg-white/95 shadow-md border-b border-gray-200 dark:bg-gray-900/95"
            : "bg-white/90 dark:bg-gray-900/90"
        )}
      >
        {/* Logo */}
        <div
          className="flex-1 flex justify-center items-center cursor-pointer"
          onClick={() => router.push("/mobile")}
        >
          <h1 className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-800 dark:from-green-400 dark:to-yellow-600">
            LuxeNest
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="w-6 h-6 text-gray-800 dark:text-white" />
          </Button>

          {/* Dark Mode */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-gray-800 dark:text-white" />
            )}
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)}>
            <ShoppingCart className="w-6 h-6 text-gray-800 dark:text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Button>

          {/* Login / Logout */}
          {auth.isLoggedIn() ? (
            <Button variant="ghost" size="icon" onClick={auth.logout}>
              <LogOut className="w-6 h-6 text-gray-800 dark:text-white" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => router.push("/auth/login")}>
              <User className="w-6 h-6 text-gray-800 dark:text-white" />
            </Button>
          )}
        </div>
      </header>

      {/* Overlays */}
      <MobileCart open={cartOpen} setOpen={setCartOpen} />
      <MobileSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
