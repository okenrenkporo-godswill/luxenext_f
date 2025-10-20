"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
  XIcon,
  LogOut,
  History,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import CartButton from "./CartButton";
import SearchBar from "./Search";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useOrderHistory } from "@/hook/queries";

interface ProfileProps {
  darkMode?: boolean;
  toggleDarkMode?: () => void;
  menuOpen?: boolean;
  setMenuOpen?: (open: boolean) => void;
}

export default function Profile({
  darkMode,
  toggleDarkMode,
  menuOpen,
  setMenuOpen,
}: ProfileProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { data: orders, isLoading, error } = useOrderHistory();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Logout failed");
        return;
      }
      logout();
      router.replace("/login");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Something went wrong during logout");
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="flex items-center gap-4"
    >
      <SearchBar />
      <HeartIcon className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer hover:text-indigo-500 transition" />
      <BellIcon className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer hover:text-indigo-500 transition" />
      <CartButton />

      {toggleDarkMode && (
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? (
            <SunIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          )}
        </button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold hover:ring-2 hover:ring-indigo-300 transition">
            {user.username?.[0]?.toUpperCase() || "U"}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="cursor-default flex flex-col items-start text-sm">
            <span className="font-semibold">{user.username}</span>
            <span className="text-gray-500 text-xs">{user.email}</span>
            <span className="text-gray-400 text-xs capitalize">{user.role}</span>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/user/account">My Account</Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-2"
            onClick={() => setOpen(true)}
          >
            <History className="w-4 h-4 text-indigo-600" />
            Order History
          </DropdownMenuItem>

          {user.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard">Admin Panel</Link>
            </DropdownMenuItem>
          )}

          {user.role === "seller" && (
            <DropdownMenuItem asChild>
              <Link href="/seller/dashboard">Seller Dashboard</Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {setMenuOpen && (
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      )}

      {/* 🧾 Drawer with Glassy Blur */}
      <AnimatePresence>
        {open && (
          <>
            {/* Blurred Background */}
            <motion.div
              className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-2xl border-l border-white/20 z-50"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/30">
                <h2 className="text-lg font-semibold text-indigo-600">Order History</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-indigo-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto max-h-[85vh]">
                {isLoading ? (
                  <p className="text-gray-500 text-sm">Loading orders...</p>
                ) : error ? (
                  <p className="text-red-500 text-sm">Failed to load orders.</p>
                ) : orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border border-white/30 rounded-xl p-4 bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-700/60 transition"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium text-sm">
                          Ref: {order.order_reference}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            order.payment_status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Total: ₦{order.total_amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Status: {order.status}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center">
                    No orders found
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
