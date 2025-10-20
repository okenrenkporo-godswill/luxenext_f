"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useProductsByCategory } from "@/hook/queries";

export default function CategoryPage() {
  const params = useParams();
  const id = params?.id as string; // 👈 always a string from the URL
  const { data: products = [], isLoading } = useProductsByCategory(id);

  // 🟢 Debug log
  console.log("Products response for category", id, ":", products);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">
        Products in Category {id}
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="p-4 border rounded-lg shadow-sm">
              <div className="relative w-full h-32 flex items-center justify-center">
                <Image
                  src={product.thumbnail_url || "/placeholder.png"}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="object-contain max-h-32"
                />
              </div>
              <h3 className="mt-2 text-sm font-semibold truncate">
                {product.name}
              </h3>
              <p className="text-green-700 font-bold">${product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
