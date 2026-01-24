"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl transition-all duration-300 ${
        isDark
          ? "bg-slate-700 text-yellow-400 hover:bg-slate-600"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${className}`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: [1, 0.8, 1],
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isDark ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  );
}

export default ThemeToggle;
