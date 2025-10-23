"use client";

import { useState } from "react";
import { useProducts } from "@/hook/queries";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function MobileProductList() {
  const { data: products = [], isLoading, error } = useProducts();
  const ITEMS_PER_PAGE = 16;
  const [page, setPage] = useState(0);

  if (isLoading) return <p className="text-center mt-4">Loading products...</p>;
  if (error) return <p className="text-center mt-4">Failed to load products.</p>;
  if (products.length === 0) return <p className="text-center mt-4">No products found.</p>;

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const visibleProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="px-3 mt-4">
      <div className="flex items-center mb-4">
        <span className="w-2 h-6 bg-red-700 rounded mr-2"></span>
        <h2 className="text-black font-bold text-lg">Product</h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-4 gap-3">
        <AnimatePresence>
          {visibleProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              {/* Navigate to Product Detail page on click */}
              <Link href={`/products/${product.id}`} className="w-16 h-16 relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 cursor-pointer hover:scale-105 transition-transform duration-300 relative">
                  <Image
                    src={product.thumbnail_url || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              <p className="text-[10px] font-semibold text-center mt-1 truncate w-16">
                {product.name.length > 12 ? product.name.slice(0, 12) + "..." : product.name}
              </p>
              <p className="text-green-700 font-bold text-[10px] mt-0.5">₦{product.price}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* View More / Previous Section */}
      <div className="mt-6 px-4 py-4 bg-gradient-to-r from-green-900 to-gray-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-lg text-gray-200 flex-1 text-center sm:text-left">
          Explore more products and exclusive deals now!
        </p>

        <div className="flex gap-2">
          {page > 0 && (
            <Button
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full shadow hover:bg-gray-400 transition-colors duration-300"
            >
              Previous
            </Button>
          )}
          {page < totalPages - 1 && (
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-green-700 text-white rounded-full shadow hover:bg-green-800 transition-colors duration-300"
            >
              View More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
