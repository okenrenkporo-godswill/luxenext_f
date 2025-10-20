"use client";


import MobileProductList from "@/components/MobileSection/MobileProduct";
import ProductsList from "@/components/Section/Product";
import { useIsMobile } from "@/lib/mobile";

export default function ProductsPage() {
  const isMobile = useIsMobile();

  return (
    <div className="max-w-7xl mx-auto flex gap-6 p-6">
      <main className="flex-1">
        {isMobile ? <MobileProductList /> : <ProductsList />}
      </main>
    </div>
  );
}
