"use client";

import { useState } from "react";
import { useProducts, useAddCartItem, useAddWishlistItem } from "@/hook/queries";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { ShoppingBag, Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function MobileProductList() {
  const { data: products = [], isLoading, error } = useProducts();
  const ITEMS_PER_PAGE = 16;
  const [page, setPage] = useState(0);
  
  const addItem = useCartStore((state) => state.addItem);
  const addCartMutation = useAddCartItem();
  const addWishlistMutation = useAddWishlistItem();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const user = useAuthStore((state) => state.user);

  const handleWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn || !user) {
        toast.error("Please login to save items");
        return;
    }
    
    addWishlistMutation.mutate({ user_id: user.id, product_id: product.id }, {
      onSuccess: () => toast.success(`${product.name} saved to wishlist`),
      onError: () => toast.error("Failed to save item")
    });
  };

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    const itemData = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.thumbnail_url || product.image_url || "/placeholder.png",
    };

    if (isLoggedIn) {
      addCartMutation.mutate({ product_id: product.id, quantity: 1 }, {
        onSuccess: () => toast.success(`${product.name} added to cart`),
        onError: () => toast.error("Failed to add to cart")
      });
    } else {
      addItem(itemData);
      toast.success(`${product.name} added to cart`);
    }
  };
  if (isLoading) return <p className="text-center mt-4 text-sm text-gray-500 font-medium">Elevating your style...</p>;
  if (error) return <p className="text-center mt-4">Failed to load products.</p>;
  if (products.length === 0) return <p className="text-center mt-4">No products found.</p>;

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const visibleProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="px-3 mt-4">
      <div className="flex items-center mb-6">
        <span className="w-2 h-6 bg-green-800 rounded mr-2"></span>
        <h2 className="text-black font-black text-xl tracking-tighter uppercase">Products</h2>
      </div>

      {/* Product Grid - 2 Column Premium Minimalist */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-12 px-2">
        <AnimatePresence>
          {visibleProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: (i % 4) * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col group"
            >
              {/* Image Container */}
              <div className="relative aspect-square mb-4 overflow-hidden bg-gray-50 rounded-2xl group">
                  <Link href={`/products/${product.id}`} className="block w-full h-full">
                    <Image
                        src={product.thumbnail_url || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </Link>
                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-black text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest pointer-events-none">
                    New Arrival
                  </div>
                  {/* Heart Icon */}
                  <button 
                    onClick={(e) => handleWishlist(e, product)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/70 backdrop-blur-md rounded-lg flex items-center justify-center shadow-sm transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 active:scale-90"
                  >
                    <Heart className="w-4 h-4 text-gray-500" />
                  </button>
                  {/* Quick Add Button */}
                  <button 
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 active:scale-90"
                  >
                    <ShoppingBag className="w-5 h-5 text-green-900" strokeWidth={2.5} />
                  </button>
              </div>

              {/* Product Info - Minimalist & Centered */}
              <div className="text-center px-1">
                  <h3 className="text-sm font-bold text-gray-900 truncate mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-black text-green-800 tracking-tight">₦{(product.price).toLocaleString()}</span>
                    <span className="text-[10px] text-gray-300 line-through font-bold">₦{(product.price * 1.2).toLocaleString()}</span>
                  </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination - Themed Minimalist */}
      <div className="mt-16 flex justify-center items-center gap-6">
        {page > 0 && (
          <button
            onClick={() => {
                setPage((prev) => prev - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-green-700 transition-colors"
          >
            Prev
          </button>
        )}
        
        <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 transition-all duration-300 rounded-full ${page === i ? 'w-8 bg-green-700' : 'w-2 bg-gray-200'}`} 
                  onClick={() => {
                      setPage(i);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
            ))}
        </div>

        {page < totalPages - 1 && (
          <button
            onClick={() => {
                setPage((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[10px] font-black uppercase tracking-widest text-gray-900 hover:text-green-700 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
