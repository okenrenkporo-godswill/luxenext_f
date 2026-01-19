"use client";

import { useParams } from "next/navigation";
import MobileHeader from "@/components/MobileSection/MobileHeader";
import MobileNav from "@/components/MobileSection/MobileNav";
import MobileProductList from "@/components/MobileSection/MobileProduct";
import { useProductsByCategory } from "@/hook/queries";

export default function ShopCategoryPage() {
  const { category } = useParams();

  return (
    <div className="min-h-screen bg-white pb-24">
      
      <div className="px-5 pt-8">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-800/60 mb-1">
            Browse Collection
        </h2>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter capitalize">
            Shop {category || "All"}
        </h1>
      </div>

      <section className="mt-8 px-2">
        <MobileProductList />
      </section>

      <MobileNav />
    </div>
  );
}
