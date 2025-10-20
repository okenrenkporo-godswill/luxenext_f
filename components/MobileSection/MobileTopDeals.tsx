"use client";

import { useTopProducts } from "@/hook/queries";
import { Product } from "@/lib/api";
import { RotatingLines } from "react-loader-spinner";
import Link from "next/link";

export default function MobileTopDeals() {
  const { data: topProducts = [], isLoading, isError } = useTopProducts();

  return (
    <div className="w-full px-3 mt-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <span className="w-2 h-6 bg-red-700 rounded mr-2"></span>
        <h2 className="text-black font-bold text-lg">🔥 Top Deals</h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-3">
          <RotatingLines
            visible={true}
            height="25"
            width="25"
            color="#c86d5d"
            strokeWidth="4"
            animationDuration="0.75"
          />
        </div>
      ) : isError ? (
        <p className="text-red-500">Failed to load top deals</p>
      ) : topProducts.length > 0 ? (
        <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
          {topProducts.map((product: Product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="flex-shrink-0 w-48 cursor-pointer"
            >
              <div className="group">
                <img
                  src={product.image_url || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                />
                <h4 className="font-bold text-green-900 mt-2 truncate">
                  {product.name}
                </h4>
                <p className="text-gray-700 text-sm truncate">{product.description}</p>
                <p className="font-bold text-green-900 mt-1">₦{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No top deals available</p>
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
