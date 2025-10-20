"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductDetailProps {
  product: {
    id: number;
    name: string;
    price: number;
    description?: string; 
    image_url?: string;
    thumbnail_url?: string;
    stock?: number;
  };
  onAddToCart?: (productId: number, quantity: number) => void;
}

export default function ProductDetail({ product, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart(product.id, quantity);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: Product Image */}
      <div>
        <div className="w-full h-96 relative mb-4">
          <Image
            src={product.image_url || product.thumbnail_url || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-contain rounded-md"
            priority
          />
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col justify-start">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 text-2xl text-red-600 font-semibold">${product.price}</p>
        <p className="mt-4 text-gray-700">{product.description}</p>

        {/* Quantity selector */}
        <div className="mt-6 flex items-center gap-4">
          <label htmlFor="quantity" className="font-medium">Quantity:</label>
          <input
            type="number"
            id="quantity"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-20 border rounded-md px-2 py-1"
          />
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          className="mt-6 bg-yellow-500 text-black font-semibold py-3 px-6 rounded-md hover:bg-yellow-600 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
