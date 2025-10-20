"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCategories, useProductsByCategory } from "@/hook/queries";
import { motion } from "framer-motion";
import Image from "next/image";

type CategoriesProps = {
  onCategorySelect?: (category: any) => void;
};

export default function MobileCategories({ onCategorySelect }: CategoriesProps) {
  const { data: categories = [] } = useCategories();
  const params = useParams();
  const router = useRouter();
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
        <span className="w-2 h-6 bg-red-700 rounded mr-2"></span>
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
              className={`whitespace-nowrap px-5 py-2 text-sm font-medium flex-shrink-0 transition-all duration-300 rounded-full border ${
                isActive
                  ? "bg-black text-white border-black shadow-md"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
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
              whileHover={{ scale: 1.05, boxShadow: "0px 4px 10px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 w-40 bg-white rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 p-3 cursor-pointer relative group"
            >
              <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden">
                <Image
                  src={product.thumbnail_url || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="text-sm font-semibold truncate">{product.name}</h4>
              <p className="text-gray-800 font-bold mt-1">${product.price}</p>
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
