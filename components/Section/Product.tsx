"use client";

import { useState } from "react";
import { useProducts, useAddWishlistItem } from "@/hook/queries";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export default function MobileProductList() {
  const { data: products = [], isLoading, error } = useProducts();
  const addWishlistMutation = useAddWishlistItem();
  const { user, isLoggedIn } = useAuthStore();
  const ITEMS_PER_PAGE = 16;
  const [page, setPage] = useState(0);
  const [wishlistLoading, setWishlistLoading] = useState<number | null>(null);

  if (isLoading) return <p className="text-center mt-4">Loading products...</p>;
  if (error) return <p className="text-center mt-4">Failed to load products.</p>;
  if (products.length === 0)
    return <p className="text-center mt-4">No products found.</p>;

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const visibleProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // ✅ Handle Add to Wishlist
  // ✅ Handle Add to Wishlist
  const handleAddToWishlist = (productId: number, productName: string) => {
    if (!isLoggedIn || !user) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }

    setWishlistLoading(productId);

    addWishlistMutation.mutate(
      { user_id: user.id, product_id: productId }, // ✅ include user_id
      {
        onSuccess: () => {
          toast.success(`${productName} added to wishlist`);
          setWishlistLoading(null);
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.detail || "Failed to add to wishlist";
          toast.error(message);
          setWishlistLoading(null);
        },
      }
    );
  };


  return (
    <div className="px-3 mt-4">
      {/* Section Title */}
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
              className="relative flex flex-col items-center group"
            >
              {/* Clickable Product Card */}
              <Link
                href={`/products/${product.id}`}
                className="w-16 h-16 relative group-hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 relative">
                  <Image
                    src={product.thumbnail_url || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Heart Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault(); // prevent navigation on heart click
                    handleAddToWishlist(product.id, product.name);
                  }}
                  disabled={wishlistLoading === product.id}
                  className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition-colors"
                >
                  <Heart
                    size={14}
                    className={`transition-colors ${
                      wishlistLoading === product.id
                        ? "text-gray-400 animate-pulse"
                        : "text-gray-500 group-hover:text-red-600"
                    }`}
                  />
                </button>
              </Link>

              {/* Product Info */}
              <p className="text-[10px] font-semibold text-center mt-1 truncate w-16">
                {product.name.length > 12
                  ? product.name.slice(0, 12) + "..."
                  : product.name}
              </p>
              <p className="text-green-700 font-bold text-[10px] mt-0.5">
                ₦{product.price}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
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
