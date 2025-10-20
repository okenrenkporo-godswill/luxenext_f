"use client";

import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchProducts } from "@/hook/queries";
import { motion, AnimatePresence } from "framer-motion";

interface MobileSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSearch({ open, onClose }: MobileSearchProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { data, isLoading } = useSearchProducts(query, {
    page: 1,
    limit: 10,
  });

  const products = data?.data ?? [];

  // ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
          {/* === Search Header === */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 shadow-sm">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="flex-1"
            />
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* === Search Results === */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : query && products.length > 0 ? (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      router.push(`/products/${product.id}`);
                      onClose();
                    }}
                    className="flex items-center gap-3 border rounded-xl p-2 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={product.image_url || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.category_id}
                      </p>
                      <p className="text-green-600 font-bold mt-1 text-sm">
                        ₦{product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : query ? (
              <p className="text-center text-gray-400 mt-10">
                No products found 😕
              </p>
            ) : (
              <p className="text-center text-gray-400 mt-10">
                Search for something 🛍️
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
