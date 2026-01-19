"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useProduct, useProductsByCategory, useAddCartItem, useAddWishlistItem } from "@/hook/queries";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Star, Heart, Plus, Minus, ShoppingBag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";




export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id as string);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const isCartOpen = useCartStore((state) => state.isOpen);
  const addCartMutation = useAddCartItem();
  const addWishlistMutation = useAddWishlistItem();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const user = useAuthStore((state) => state.user);

  const { data: relatedProducts, isLoading: relatedLoading } = useProductsByCategory(
    product?.category_id || ""
  );

  const handleWishlist = () => {
    if (!product || !user) {
        toast.error("Please login to save items");
        return;
    }
    setLiked(!liked);
    addWishlistMutation.mutate({ user_id: user.id, product_id: product.id });
  };

  
  const handleAddToCart = (product: any, quantity: number) => {
    if (!product) return;

    const itemData = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.thumbnail_url || product.image_url || "/placeholder.png",
    };

    if (isLoggedIn) {
      // Optimistic UI
      const tempId = Date.now();
      addItem({ ...itemData, product_id: tempId });

      addCartMutation.mutate(
        { product_id: product.id, quantity },
        {
          onSuccess: (data) => {
            removeItem(tempId);
            addItem({ ...itemData, product_id: data.id });
            toast.success(`${product.name} added to cart`);
          },
          onError: () => {
            removeItem(tempId);
            toast.error("Could not add item to cart");
          },
        }
      );
    } else {
      const existingItem = useCartStore.getState().items.find(
        (i) => i.product_id === product.id
      );

      if (existingItem) {
        addItem({ ...existingItem, quantity: existingItem.quantity + quantity });
      } else {
        addItem(itemData);
      }

      toast.success(`${product.name} added to cart`);
    }
  };

  // -------------------------
  // Skeleton Loading
  // -------------------------
  if (isLoading)
    return (
      <div className="bg-gray-50 min-h-screen animate-pulse p-4 space-y-6">
        <Skeleton className="w-full h-[380px] rounded-b-3xl" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex items-center justify-between mt-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border rounded-xl shadow-sm p-3 space-y-2">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );

  if (error)
    return <p className="text-center py-10 text-red-600">Failed to load product</p>;
  if (!product)
    return <p className="text-center py-10 text-red-600">Product not found</p>;

  // -------------------------
  // Main Product Page
  // -------------------------
  return (
    <div className="bg-gray-50 min-h-screen pb-40">
      {/* Product Image */}
      <div className="relative bg-white shadow-sm">
        <Image
          src={product.image_url || product.thumbnail_url || "/placeholder.png"}
          alt={product.name}
          width={600}
          height={600}
          className="w-full h-[380px] object-cover rounded-b-3xl"
        />
        <button
          onClick={handleWishlist}
          className={`absolute top-5 right-5 bg-white p-2 rounded-full shadow-md transition-all active:scale-90 ${
            liked ? "text-red-500 scale-110" : "text-gray-700"
          }`}
        >
          <Heart fill={liked ? "currentColor" : "none"} size={22} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 leading-snug">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <Star className="text-yellow-400" fill="#FACC15" size={18} />
          <span className="text-sm text-gray-600">4.5 (2.1k reviews)</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-orange-600">
            ₦{product.price.toLocaleString()}
          </p>
          <button className="flex items-center text-sm text-gray-500">
            <Share2 className="mr-1" size={16} /> Share
          </button>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mt-2">
          {product.description || "No product description available."}
        </p>
      </div>

      {/* Quantity Section */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border shadow-sm p-4 flex items-center justify-between">
        <span className="text-gray-800 font-medium">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
          >
            <Minus size={16} />
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Floating Cart Buttons */}
      {!isCartOpen && (
        <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] px-6 py-5 flex items-center justify-between gap-4 z-50 rounded-t-[2.5rem]">
          <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Price</span>
              <span className="text-xl font-black text-gray-900">₦{(product.price * quantity).toLocaleString()}</span>
          </div>
          <Button
            onClick={() => handleAddToCart(product, quantity)}
            className="flex-1 bg-green-800 hover:bg-green-900 text-white font-bold py-7 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-green-100 transition-all active:scale-95"
          >
            <ShoppingBag size={20} strokeWidth={2.5} /> 
            <span className="text-sm">Add to Cart</span>
          </Button>
        </div>
      )}

      {/* Related Section */}
      <div className="mt-10 px-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          You may also like
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {relatedLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-xl shadow-sm p-3 space-y-2 animate-pulse"
                >
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : relatedProducts?.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border rounded-xl shadow-sm p-3 hover:shadow-md transition cursor-pointer"
                  onClick={() => router.push(`/products/${p.id}`)}

                >
                  <div className="h-32 w-full relative">
                    <Image
                      src={p.thumbnail_url || p.image_url || "/placeholder.png"}
                      alt={p.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-sm mt-2 font-medium text-gray-800">{p.name}</p>
                  <p className="text-orange-600 text-sm font-semibold mt-1">
                    ₦{p.price.toLocaleString()}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
