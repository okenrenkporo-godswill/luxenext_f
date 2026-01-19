"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCategories, useProductsByCategory, useAddCartItem, useAddWishlistItem } from "@/hook/queries";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

type CategoriesProps = {
  onCategorySelect?: (category: any) => void;
};

export default function MobileCategories({ onCategorySelect }: CategoriesProps) {
  const { data: categories = [] } = useCategories();
  const params = useParams();
  const router = useRouter();
  
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
  const activeCategory = params?.id;
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const observerRef = useRef<HTMLDivElement>(null);

  // Auto-select first category
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
      onCategorySelect && onCategorySelect(categories[0]);
    }
  }, [categories]);

  const { data: products = [], isLoading } = useProductsByCategory(selectedCategory?.id);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && visibleCount < products.length) {
        setVisibleCount((prev) => prev + 6);
      }
    },
    [visibleCount, products.length]
  );

  useEffect(() => {
    const option = { root: null, rootMargin: "20px", threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  return (
    <div className="w-full mt-6 px-3">
      {/* Title */}
      <div className="flex items-center mb-4">
        <span className="w-2 h-6 bg-green-800 rounded mr-2"></span>
        <h2 className="text-black font-bold text-lg">Categories</h2>
      </div>

      {/* Category Buttons */}
      <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const isActive =
            selectedCategory?.id === cat.id || String(cat.id) === activeCategory;
          return (
            <motion.button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(6);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`whitespace-nowrap px-5 py-2 text-sm font-black flex-shrink-0 transition-all duration-300 rounded-full border tracking-tight ${
                isActive
                  ? "bg-green-800 text-white border-green-800 shadow-lg shadow-green-100"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat.name}
            </motion.button>
          );
        })}
      </div>

      {/* Product Section */}
      <div className="mt-6 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex space-x-4">
          {products.slice(0, visibleCount).map((product) => (
            <motion.div
              key={product.id}
              onClick={() => router.push(`/products/${product.id}`)} // ✅ Go to product page
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(0,0,0,0.05)" }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 w-44 bg-white rounded-2xl shadow-sm border border-gray-100 p-3 cursor-pointer relative group"
            >
              <div className="relative w-full h-40 mb-3 rounded-xl overflow-hidden bg-gray-50 group">
                <Image
                  src={product.thumbnail_url || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Heart Icon */}
                <button 
                  onClick={(e) => handleWishlist(e, product)}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/70 backdrop-blur-md rounded-lg flex items-center justify-center shadow-sm transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 active:scale-90"
                >
                  <Heart className="w-3.5 h-3.5 text-gray-500" />
                </button>
                {/* Product Quick Add */}
                <button 
                  onClick={(e) => handleQuickAdd(e, product)}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-md rounded-lg flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 active:scale-90"
                >
                  <ShoppingBag className="w-4 h-4 text-green-900" strokeWidth={2.5} />
                </button>
              </div>
              <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
              <p className="text-green-800 font-black mt-1">₦{product.price.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div ref={observerRef} className="h-1"></div>

      {/* Hide scrollbars globally */}
      <style jsx global>{`
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
