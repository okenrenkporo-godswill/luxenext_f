"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  LogOut,
  ChevronDown,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function AccountDropdown() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Safely handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      logout();
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout");
    }
  };

  if (!mounted) {
    return (
      <div className="w-24 h-10 bg-gray-100 animate-pulse rounded-md" />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200">
          <User className="w-6 h-6" />
          <span className="hidden lg:inline text-sm font-medium">
            {user ? `Hi, ${user.username}` : "Account"}
          </span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 p-2">
        {!user ? (
          <div className="p-2">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 mb-2"
              onClick={() => router.push("/login")}
            >
              LOGIN
            </Button>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/register" className="cursor-pointer py-2">
                <User className="w-4 h-4 mr-2" /> CREATE ACCOUNT
              </Link>
            </DropdownMenuItem>
          </div>
        ) : (
          <>
            <div className="px-2 py-1.5 mb-1">
              <p className="text-xs text-gray-500 uppercase font-bold">My Account</p>
            </div>
            <DropdownMenuItem asChild>
              <Link href="/account" className="cursor-pointer py-2">
                <User className="w-4 h-4 mr-2 text-green-600" /> My Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/user/dashboard" className="cursor-pointer py-2 text-indigo-600">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem asChild>
          <Link href="/orders" className="cursor-pointer py-2">
            <Package className="w-4 h-4 mr-2 text-green-600" /> Orders
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/wishlist" className="cursor-pointer py-2">
            <Heart className="w-4 h-4 mr-2 text-green-600" /> Saved Items
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/help" className="cursor-pointer py-2">
            <HelpCircle className="w-4 h-4 mr-2" /> Help Center
          </Link>
        </DropdownMenuItem>

        {user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-700 cursor-pointer py-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" /> LOGOUT
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
