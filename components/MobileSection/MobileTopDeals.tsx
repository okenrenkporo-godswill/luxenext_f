"use client";

import { useTopProducts, useAddCartItem, useAddWishlistItem } from "@/hook/queries";
import { Product } from "@/lib/api";
import { RotatingLines } from "react-loader-spinner";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { ShoppingBag, Heart } from "lucide-react";

export default function MobileTopDeals() {
  const { data: topProducts = [], isLoading, isError } = useTopProducts();
  const addItem = useCartStore((state) => state.addItem);
  const addCartMutation = useAddCartItem();
  const addWishlistMutation = useAddWishlistItem();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const user = useAuthStore((state) => state.user);

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
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

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
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

  return (
    <div className="w-full px-3 mt-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <span className="w-2 h-6 bg-green-800 rounded mr-2"></span>
        <h2 className="text-black font-black text-xl tracking-tighter uppercase">🔥 Top Deals</h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <RotatingLines visible={true} height="25" width="25" color="#15803d" strokeWidth="4" animationDuration="0.75" />
        </div>
      ) : isError ? (
        <p className="text-red-500 text-center py-4">Failed to load top deals</p>
      ) : topProducts.length > 0 ? (
        <div className="flex overflow-x-auto space-x-5 pb-6 scrollbar-hide snap-x">
          {topProducts.map((product: Product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="flex-shrink-0 w-[240px] cursor-pointer snap-start"
            >
              <div className="group relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-50 shadow-sm border border-gray-100 group">
                    <img
                      src={product.image_url || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Discount Badge */}
                    <div className="absolute top-4 right-4 bg-green-700 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg pointer-events-none">
                        HOT DEAL
                    </div>
                    {/* Heart Icon */}
                    <button 
                      onClick={(e) => handleWishlist(e, product)}
                      className="absolute top-4 left-4 w-9 h-9 bg-white/70 backdrop-blur-md rounded-xl flex items-center justify-center shadow-sm transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 active:scale-90"
                    >
                      <Heart className="w-4 h-4 text-gray-400" />
                    </button>
                    {/* Quick Add Button */}
                    <button 
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 active:scale-90"
                    >
                      <ShoppingBag className="w-6 h-6 text-green-900" strokeWidth={2.5} />
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <h4 className="font-black text-gray-900 text-sm tracking-tight truncate">
                      {product.name}
                    </h4>
                    <p className="font-bold text-green-700 mt-1">₦{product.price.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No top deals available</p>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
