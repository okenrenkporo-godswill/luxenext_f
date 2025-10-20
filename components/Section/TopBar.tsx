"use client";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between gap-4 p-4 bg-transparent">
      <div className="flex items-center gap-4">
        <div className="relative w-[480px]">
          <input
            placeholder="Search here..."
            className="w-full bg-[#0b1620] placeholder-gray-400 rounded-lg py-2 px-3 text-sm focus:outline-none"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <motion.button whileTap={{ scale: 0.95 }} className="p-2 rounded-md bg-[#0b1620]">
          <Bell className="w-5 h-5 text-gray-300" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className="p-2 rounded-md bg-[#0b1620]">
          <Moon className="w-5 h-5 text-gray-300" />
        </motion.button>

        <div className="flex items-center gap-3 bg-[#0b1620] px-3 py-1 rounded-lg">
          <img src="/avatar-placeholder.png" alt="user" className="w-8 h-8 rounded-full" />
          <div className="text-left">
            <div className="text-sm text-white">Kristin Watson</div>
            <div className="text-xs text-gray-400">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
