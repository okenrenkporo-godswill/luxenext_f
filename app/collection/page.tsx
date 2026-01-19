"use client";
import MobileNav from "@/components/MobileSection/MobileNav";
import MobileProductList from "@/components/MobileSection/MobileProduct";

export default function CollectionPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
     
      <div className="px-5 pt-8">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-800/60 mb-1">
            Exclusive
        </h2>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
            Our Collection
        </h1>
      </div>

      <section className="mt-8 px-2">
        <MobileProductList />
      </section>

      <MobileNav />
    </div>
  );
}
