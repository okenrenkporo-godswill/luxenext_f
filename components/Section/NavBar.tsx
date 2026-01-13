"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LogoSection from "./LogoSection";
import MenuSection from "./MenuSection";
import { Button } from "../ui/button";
import {
  UserIcon,
  BellIcon,
  MenuIcon,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import SearchBar from "./Search";
import CartButton from "./CartButton";
import AccountDropdown from "./AccountDropdown";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) {
    return (
      <nav className="bg-white h-16 border-b flex items-center px-4">
        <div className="max-w-7xl mx-auto w-full flex justify-between">
          <div className="w-32 h-8 bg-gray-100 animate-pulse rounded" />
          <div className="hidden md:block flex-1 max-w-xl h-10 bg-gray-100 animate-pulse rounded-full mx-8" />
          <div className="w-24 h-8 bg-gray-100 animate-pulse rounded" />
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`bg-white dark:bg-gray-900 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md py-2" : "py-4 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* 1. Logo & Basic Links */}
          <div className="flex items-center gap-8">
            <LogoSection />
            <div className="hidden lg:flex items-center gap-6">
              <Link href="/product" className="text-sm font-semibold text-gray-700 hover:text-green-600 dark:text-gray-200 transition-colors">
                Products
              </Link>
              <Link href="/categories" className="text-sm font-semibold text-gray-700 hover:text-green-600 dark:text-gray-200 transition-colors">
                Categories
              </Link>
            </div>
          </div>

          {/* 2. Prominent Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl px-4">
            <SearchBar />
          </div>

          {/* 3. Actions */}
          <div className="flex items-center gap-2 md:gap-6">
            
            {/* Account Dropdown (The consolidated fix) */}
            <AccountDropdown />

            {/* Help Dropdown (Optional/Static) */}
            <button className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-green-600 dark:text-gray-200">
               <HelpCircle className="w-5 h-5 md:w-6 md:h-6" />
               <span className="hidden lg:inline">Help</span>
               <ChevronDown className="w-4 h-4 opacity-50" />
            </button>

            {/* Cart */}
            <div className="relative">
              <CartButton />
            </div>

            {/* Mobile Menu Toggle (Simplified) */}
            <button className="md:hidden p-1">
              <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </div>

        {/* Mobile Search - Visible only on mobile */}
        <div className="mt-3 md:hidden">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
}
