"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when search is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* 🔍 Search Icon (shown when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center"
          aria-label="Open search"
        >
          <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      )}

      {/* 🔎 Full Header Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className="fixed top-0 left-0 w-full h-[110px] md:h-[130px] bg-white dark:bg-gray-900 shadow-lg z-[1000] flex items-center justify-between px-4 md:px-8"
          >
            {/* Input Section */}
            <div className="flex items-center w-full max-w-5xl mx-auto gap-3">
              <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, brands, or categories..."
                className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100 border p-3 border-grey-100 rounded-full gap-5  placeholder-gray-400 text-sm md:text-base"
              />
            </div>

            {/* Close Button (❌) */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 md:right-8 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              aria-label="Close search"
            >
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
