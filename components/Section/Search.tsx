"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useSearchProducts } from "@/hook/queries";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data, isLoading } = useSearchProducts(query, {
    page: 1,
    limit: 6,
  });

  const products = data?.data ?? [];

  // Auto-focus input when search is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // For now we redirect to first match or just stay here with results
      if (products.length > 0) {
        router.push(`/products/${products[0].id}`);
        setIsOpen(false);
        setQuery("");
      }
    }
  };

  return (
    <div className="relative">
      {/* 🔍 Search Icon (shown when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-all group"
          aria-label="Open search"
        >
          <Search className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
          <span className="text-xs text-white/50 font-medium">Search for premium items...</span>
        </button>
      )}

      {/* 🔎 Full Header Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex flex-col p-4 pt-10"
          >
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl"
            >
                {/* Input Section */}
                <form onSubmit={handleSearch} className="flex items-center p-4 gap-3 border-b border-gray-100 dark:border-gray-800">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-base font-medium"
                  />
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin text-green-700" />}
                  <button
                    type="button"
                    onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </form>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {query && products.length > 0 ? (
                        <div className="grid grid-cols-1 gap-1">
                            {products.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        router.push(`/products/${p.id}`);
                                        setIsOpen(false);
                                        setQuery("");
                                    }}
                                    className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all text-left group"
                                >
                                    <div className="w-14 h-14 relative bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                        <Image src={p.image_url || "/placeholder.png"} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{p.name}</h4>
                                        <p className="text-xs text-green-700 font-black mt-0.5">₦{p.price.toLocaleString()}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : query && !isLoading ? (
                        <div className="py-10 text-center">
                            <p className="text-gray-400 text-sm font-medium">No matches found for "{query}"</p>
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            <p className="text-gray-300 text-[10px] uppercase tracking-widest font-black">Trending Searches</p>
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {["Luxe", "Modern", "Organic"].map(tag => (
                                    <span key={tag} className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-500 cursor-pointer hover:bg-green-50 hover:text-green-700 transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
