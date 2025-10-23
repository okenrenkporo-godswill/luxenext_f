"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useWishlist, useDeleteWishlistItem } from "@/hook/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, HeartOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function WishlistPage() {
  const { user } = useAuthStore();
  const { data: wishlist, isLoading, isError, refetch } = useWishlist(user?.id || null);
  const deleteWishlist = useDeleteWishlistItem();

  const handleRemove = (id: number) => {
    deleteWishlist.mutate(id, {
      onSuccess: () => {
        toast.success("Removed from wishlist 💔");
        refetch();
      },
      onError: () => toast.error("Failed to remove from wishlist"),
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <HeartOff className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-500 text-lg">Please log in to view your wishlist 💭</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        <p>Loading wishlist...</p>
      </div>
    );
  }

  if (isError || !wishlist || wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <HeartOff className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-500 text-lg">Your wishlist is empty 💤</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">My Wishlist ❤️</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <Card
            key={item.id}
            className="rounded-2xl shadow-sm hover:shadow-md transition flex flex-col"
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <img
                src={item.product?.image_url || "/placeholder.png"}
                alt={item.product?.name || "Product"}
                className="w-32 h-32 object-cover rounded-xl mb-4"
              />
              <h2 className="font-medium text-lg">{item.product?.name}</h2>
              <p className="text-gray-500 mt-1">${item.product?.price}</p>

              <Button
                onClick={() => handleRemove(item.id)}
                variant="destructive"
                size="sm"
                className="mt-4 w-full flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
