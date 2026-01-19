"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlist, useDeleteWishlistItem, useAddCartItem } from "@/hook/queries";
import { Button } from "@/components/ui/button";
import { Loader2, HeartOff, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import MobileHeader from "@/components/MobileSection/MobileHeader";
import MobileNav from "@/components/MobileSection/MobileNav";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";

export default function WishlistPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data: wishlist, isLoading, isError, refetch } = useWishlist(user?.id || null);
  const deleteWishlist = useDeleteWishlistItem();
  const addCartMutation = useAddCartItem();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemove = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    deleteWishlist.mutate(id, {
      onSuccess: () => {
        toast.success("Removed from wishlist");
        refetch();
      },
    });
  };

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    const qty = 1;
    if (user) {
      addCartMutation.mutate({ product_id: item.product.id, quantity: qty }, {
        onSuccess: () => toast.success(`${item.product.name} added to cart`),
      });
    } else {
      addItem({
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: qty,
        image: item.product.thumbnail_url || item.product.image_url || "/placeholder.png",
      });
      toast.success(`${item.product.name} added to cart`);
    }
  };

  if (!mounted || !_hasHydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-green-700" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <HeartOff className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Login Required</h2>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm font-medium">Please sign in to your Luxenext account to view your saved items.</p>
        <Button onClick={() => router.push("/login")} className="w-full max-w-[240px] bg-green-800 hover:bg-green-900 rounded-2xl h-14 font-bold">
            Sign In Now
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 pt-16">
      
      <div className="px-6 pt-10">
        <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-7 bg-green-800 rounded-full" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-800/60">
                Member Favorites
            </h2>
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Your Wishlist</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">A curated collection of your favorite pieces.</p>
      </div>

      <div className="px-5 mt-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin w-8 h-8 text-green-700" />
            <p className="text-xs font-black uppercase tracking-widest text-gray-300">Curating your list...</p>
          </div>
        ) : isError || !wishlist || wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                <HeartOff className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-bold mb-6">Your list is currently empty.</p>
            <Button onClick={() => router.push("/")} variant="outline" className="rounded-2xl px-8 border-gray-200 text-xs font-black uppercase tracking-widest h-12">
                Start Exploring
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12">
            {wishlist.map((item) => {
              const product = item.product;
              if (!product) return null; // Defensive check

              return (
                <div
                  key={item.id}
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="flex flex-col group cursor-pointer"
                >
                  <div className="relative aspect-square mb-4 rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:scale-105 group-hover:-rotate-1">
                    <Image
                      src={product.image_url || product.thumbnail_url || "/placeholder.png"}
                      alt={product.name || "Product"}
                      fill
                      className="object-cover"
                    />
                    {/* Remove Button */}
                    <button
                      onClick={(e) => handleRemove(e, item.id)}
                      className="absolute top-4 right-4 w-9 h-9 bg-white/70 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-center px-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate mb-1">{product.name}</h3>
                      <p className="text-green-800 font-black mb-4">₦{product.price.toLocaleString()}</p>
                      
                      <Button
                          onClick={(e) => handleAddToCart(e, item)}
                          className="w-full bg-gray-900 hover:bg-black text-white rounded-2xl h-12 font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-green-800 transition-colors shadow-lg"
                      >
                          <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
}
