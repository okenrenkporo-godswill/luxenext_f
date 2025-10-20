"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { X, Heart, Settings, HelpCircle, LogOut } from "lucide-react";
import { toast } from "sonner";

interface MobileAccountProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MobileAccount({ open, setOpen }: MobileAccountProps) {
  // Combined reactive subscription
  const { token, user, hydrated, logout } = useAuthStore((state) => ({
    token: state.token,
    user: state.user,
    hydrated: state.hydrated,
    logout: state.logout,
  }));

  const isLoggedIn = !!token;

  // Prevent flash before hydration
  if (!hydrated) return <p className="p-4 text-white">Loading account...</p>;

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");

      logout(); // clear client state
      toast.success("Logged out successfully");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during logout");
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent
        className="w-80 p-4 flex flex-col space-y-4 left-0 top-0 fixed h-full shadow-lg 
        bg-gradient-to-b from-green-900 to-white text-white"
      >
        {/* Drawer Header */}
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="text-white font-bold text-2xl">Account</DrawerTitle>
          <button onClick={() => setOpen(false)} className="text-white hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </DrawerHeader>

        {/* Logged In */}
        {isLoggedIn ? (
          <>
            {/* User Info */}
            <div className="border border-green-700 p-3 rounded-lg shadow-sm bg-green-800/80">
              <p className="font-semibold">{user?.username || "User"}</p>
              <p className="text-sm text-gray-200">{user?.email || "user@email.com"}</p>
            </div>

            {/* Menu List */}
            <div className="flex flex-col space-y-2">
              <Link href="/wishlist">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-green-700">
                  <Heart className="w-4 h-4 mr-2" /> Wishlist
                </Button>
              </Link>

              <Link href="/settings">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-green-700">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </Button>
              </Link>

              <Link href="/help">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-green-700">
                  <HelpCircle className="w-4 h-4 mr-2" /> Help Center
                </Button>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full justify-start text-white hover:bg-red-600 rounded-lg px-3 py-2 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          </>
        ) : (
          /* Logged Out */
          <>
            <p className="text-lg text-black font-semibold">
              Welcome! Please log in or register to access your account.
            </p>
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full justify-start text-black border-green-300 hover:bg-green-800"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                className="w-full justify-start text-black border-green-300 hover:bg-green-800"
              >
                Register
              </Button>
            </Link>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
