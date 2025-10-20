"use client";

import { useCategories } from "@/hook/queries";
import Categories from "./Categories";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function BrowseCategories() {
  const { isLoading } = useCategories(); // ✅ categories handled inside <Categories />
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-red-600 rounded-md mr-3"></div>
        <div className="w-1 h-6 bg-red-600 rounded" />
        <div>
          <p className="text-red-600 text-sm font-semibold uppercase">
            Categories
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Browse by Categories
          </h2>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
        </div>
      ) : (
        <div className="relative flex items-center">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="mr-2 p-2 bg-white border border-gray-300 text-black rounded hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Categories row */}
          <div
            ref={scrollRef}
            className="overflow-hidden flex-1"
          >
            <Categories layout="horizontal" />
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="ml-2 p-2 bg-white border border-gray-300 text-black rounded hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}
