"use client";

import { useState } from "react";
import { useProducts, useAddCartItem } from "@/hook/queries";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function ProductsList() {
  const { data: products = [], isLoading, error } = useProducts();
  const ITEMS_PER_PAGE = 12;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const addCartMutation = useAddCartItem();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Failed to load products.</p>;
  if (products.length === 0) return <p>No products available.</p>;

  const visibleProducts = products.slice(0, visibleCount);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleAddToCart = (product: any) => {
    if (!product) return;

    const itemData = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.thumbnail_url || product.image_url || "/placeholder.png",
    };

    if (isLoggedIn) {
      // Optimistic add with temporary ID
      const tempId = Date.now();
      addItem({ ...itemData, product_id: tempId });

      addCartMutation.mutate(
        { product_id: product.id, quantity: 1 },
        {
          onSuccess: (data) => {
            // Remove temporary item
            removeItem(tempId);
            // Add server item
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
      // Guest user: merge quantity if exists
      const existingItem = useCartStore.getState().items.find(
        (i) => i.product_id === product.id
      );

      if (existingItem) {
        addItem({
          ...existingItem,
          quantity: existingItem.quantity + 1,
        });
      } else {
        addItem(itemData);
      }

      toast.success(`${product.name} added to cart`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex items-center mb-8">
        <div className="w-1.5 h-8 bg-red-600 rounded-md mr-3"></div>
        <div>
          <h2 className="text-sm font-bold text-red-500">Our Products</h2>
          <p className="text-2xl font-bold">Explore our products</p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <AnimatePresence>
          {visibleProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="flex flex-col justify-between rounded-xl shadow-md border bg-white overflow-hidden transition duration-500 hover:shadow-2xl">
                {/* Image Section */}
                <div className="w-full h-36 flex items-center justify-center bg-white relative">
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Image
                      src={product.thumbnail_url || product.image_url || "/placeholder.png"}
                      alt={product.name || "Product"}
                      width={150}
                      height={150}
                      className="object-contain transition-transform duration-300 hover:scale-110"
                    />
                  </motion.div>
                </div>

                {/* Product Name */}
                <CardHeader className="px-3 pt-2 pb-1">
                  <CardTitle className="text-sm font-semibold text-gray-900 truncate">
                    {product.name}
                  </CardTitle>
                </CardHeader>

                {/* Price */}
                <CardContent className="px-3 pb-2">
                  <p className="text-base font-bold text-gray-900">
                    ₦{product.price}
                  </p>
                </CardContent>

                {/* Footer / Actions */}
                <CardFooter className="px-3 pb-3 flex justify-between gap-2">
                  <Link href={`/products/${product.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-800 text-gray-800 hover:bg-gray-900 hover:text-white rounded-md"
                    >
                      View
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    className="bg-black text-white hover:bg-gray-800 rounded-md"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* View More Button */}
      {visibleCount < products.length && (
        <div className="mt-6 text-center">
          <Button
            onClick={handleViewMore}
            className="bg-black text-white hover:bg-gray-800 rounded-md"
          >
            View All Products
          </Button>
        </div>
      )}
    </div>
  );
}
