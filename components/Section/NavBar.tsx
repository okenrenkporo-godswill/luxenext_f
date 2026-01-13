"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LogoSection from "./LogoSection";
import MenuSection from "./MenuSection";
import { Button } from "../ui/button";
import {
  UserIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import SearchBar from "./Search";
import CartButton from "./CartButton"; // ✅ Imported new Cart component
import Profile from "./Profile";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, _hasHydrated } = useAuthStore();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-white dark:bg-gray-900 transition-shadow ${
        isScrolled ? "shadow-xl" : "shadow"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <LogoSection />

          {/* Menu Links */}
          <MenuSection menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <SearchBar />

            {/* Account / Profile - Wait for hydration */}
            {!_hasHydrated ? (
              <div className="w-24 h-9 bg-gray-100 animate-pulse rounded-full" />
            ) : user ? (
              <Profile darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            ) : (
              <>
                <Link href="/login">
                  <Button className="bg-white text-black border rounded-full cursor-pointer hover:bg-gray-100 flex items-center gap-1">
                    <UserIcon className="w-5 h-5 text-gray-700" />
                    Account
                  </Button>
                </Link>

                {/* Notifications */}
                <BellIcon className="w-5 h-5 text-gray-700 cursor-pointer" />

                {/* Dark Mode */}
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
              </>
            )}

            {/* ✅ Cart Button (Reusable Component) */}
            <CartButton />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {menuOpen ? (
                <XIcon className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
