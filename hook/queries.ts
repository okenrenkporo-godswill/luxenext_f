import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";


import {
  fetchProducts,
  fetchCategories,
  fetchProductById,
  fetchProductsByCategoryId, // 👈 import this
  Product,
  Category,
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  CartItemPayload,
  fetchAllUsers,
  fetchUserById,
  updateUser,
  deleteUser,
  updateSuperadminSettings,
  createAdmin,
  deleteAdmin,
  fetchAllAdmins,
  updateUserRole,
  AppUser,
  UpdateUserPayload,
  checkoutCart, CheckoutPayload, CheckoutResponse,
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  fetchPaymentMethods,
  confirmManualPayment,
  rejectManualPayment,
  Address,
  AddressPayload,
  PaymentMethod,
  fetchOrderById, OrderResponse,
  OrderHistoryItem,
  fetchUserOrders,
  fetchAllOrders,
  fetchAdminOrderById,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  AdminOrderItem,
  UpdateOrderStatusPayload,
  fetchAddressById,
  createCategory,
  updateCategory,
  deleteCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchTopProducts,
  SearchOptions,
  searchProducts,
  fetchUserWishlist,
  fetchWishlistById,
  createWishlistItem,
  deleteWishlistItem,
  Wishlist,
  WishlistCreatePayload
} from "@/lib/api";

import { toast } from "sonner";

// ✅ Products hook
export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

export const useSearchProducts = (q: string, options?: SearchOptions) => {
  return useQuery({
    queryKey: ["search-products", q, options],
    queryFn: async () => {
      if (!q || q.trim() === "") return { data: [], pagination: { skip: 0, limit: 0, count: 0 } };
      return await searchProducts(q, options);
    },
    enabled: !!q,
    staleTime: 1000 * 60,
  });
};


// ===============================
// 🛍️ Admin Product Hooks
// ===============================


// Fetch all products (Admin)
export const useAdminProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await fetchProducts();
      return res;
    },
  });
};

// Create a product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createProduct(formData),
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: () => {
      toast.error("Failed to create product");
    },
  });
};

// Update a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateProduct(id, formData),
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: () => {
      toast.error("Failed to update product");
    },
  });
};
// ✅ Fetch top products (Admin)
export const useTopProducts = () => {
  return useQuery({
    queryKey: ["top-products"],
    queryFn: fetchTopProducts,
  });
};

// Delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });
};

// ✅ Categories hook
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};

// ✅ Product by ID hook
export const useProduct = (id: number | string) => {
  return useQuery<Product>({
    queryKey: ["product", id],   // cache per product id
    queryFn: () => fetchProductById(id),
    enabled: !!id, // only run if id exists
  });
};

// ✅ Products by Category hook
export const useProductsByCategory = (categoryId: number | string) => {
  return useQuery<Product[]>({
    queryKey: ["products", "category", categoryId], // cache per category
    queryFn: () => fetchProductsByCategoryId(categoryId),
    enabled: !!categoryId, // only fetch if categoryId is provided
  });
};

// ✅ Fetch all categories
export const useCategoriesAdmin = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};

// ✅ Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to create category"),
  });
};

// ✅ Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) => updateCategory(id, data),
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to update category"),
  });
};

// ✅ Delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to delete category"),
  });
};




// ===============================
// ✅ Fetch cart items
// ===============================

export const useCart = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      try {
        const data = await getCart();
        // Always return something safe for guests
        return data ?? { items: [] };
      } catch (err: any) {
        // If 401 (unauthorized), treat as guest and return empty cart
        if (err.response?.status === 401) {
          return { items: [] };
        }
        throw err; // re-throw other errors
      }
    },
    enabled: !!token,         // ✅ Only fetch if logged in
    staleTime: 1000 * 60 * 5, // optional: cache for 5 minutes
    retry: false,             // don’t retry by default
    initialData: { items: [] }, // fallback for server render or guests
  });
};



// Add item to cart
export const useAddCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: CartItemPayload) => addCartItem(item),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
};

// Update cart item
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ item_id, quantity }: { item_id: number; quantity: number }) => updateCartItem(item_id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
};

// Remove cart item
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item_id: number) => removeCartItem(item_id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }), // ✅ pass an object
  });
};



export const useCheckout = () => {
  return useMutation<CheckoutResponse, Error, CheckoutPayload>({
    mutationFn: checkoutCart,
    onSuccess: (data) => {
      toast.success("Checkout successful!");
      console.log("Order:", data);

      // Example: redirect based on payment method
      if (data.payment_method.toLowerCase() === "paystack") {
        // You can navigate to payment page here
        window.location.href = `/payment?ref=${data.order_reference}`;
      } else {
        toast.info(`Payment awaiting confirmation: ${data.payment_method}`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Checkout failed");
    },
  });
};





// ===============================
// 🏠 ADDRESS HOOKS
// ===============================

// ✅ Get all user addresses
export const useAddresses = (options?: { enabled?: boolean }) => {
  return useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
    ...options,
  });
};
export const useAddress = (address_id: number | null) => {
  return useQuery<Address, Error>({
    queryKey: ["address", address_id],
    queryFn: () => fetchAddressById(address_id!),
    enabled: !!address_id,
  });
};

// ✅ Create new address
export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore.getState();

  return useMutation({
    mutationFn: (data: AddressPayload) => createAddress(data, token || undefined),
    onSuccess: () => {
      toast.success("Address created successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to create address");
    },
  });
};

// ✅ Update address
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ address_id, data }: { address_id: number; data: Partial<AddressPayload> }) =>
      updateAddress(address_id, data),
    onSuccess: () => {
      toast.success("Address updated successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update address");
    },
  });
};

// ✅ Delete address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (address_id: number) => deleteAddress(address_id),
    onSuccess: () => {
      toast.success("Address deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to delete address");
    },
  });
};

// ===============================
// 💳 PAYMENT HOOKS
// ===============================

// ✅ Fetch payment methods
export const usePaymentMethods = () => {
  return useQuery<PaymentMethod[]>({
    queryKey: ["payment-methods"],
    queryFn: fetchPaymentMethods,
  });
};

// ✅ Confirm manual payment (admin only)
export const useConfirmManualPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order_id: number) => confirmManualPayment(order_id),
    onSuccess: () => {
      toast.success("Payment confirmed successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to confirm payment");
    },
  });
};

// ✅ Reject manual payment (admin only)
export const useRejectManualPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ order_id, reason }: { order_id: number; reason: string }) =>
      rejectManualPayment(order_id, reason),
    onSuccess: () => {
      toast.success("Payment rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to reject payment");
    },
  });
};


// ✅ Hook to get a single order
export const useOrder = (order_id: number | null) => {
  return useQuery<OrderResponse, Error>({
    queryKey: ["order", order_id],
    queryFn: () => fetchOrderById(order_id!),
    enabled: !!order_id,
    refetchInterval: (query) => {
      // `query.state.data` holds your OrderResponse
      const order = query.state.data;
      if (order?.payment_status === "awaiting_confirmation") {
        return 5000; // poll every 5s
      }
      return false; // stop polling otherwise
    },
    refetchOnWindowFocus: false,
  });
};

export const useOrderHistory = (options?: { enabled?: boolean }) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery<OrderHistoryItem[], Error>({
    queryKey: ["orderHistory"],
    queryFn: fetchUserOrders,
    enabled: isLoggedIn(), // default enabled check
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};


// ===============================
// 🧾 ADMIN ORDER HOOKS
// ===============================


// ✅ Fetch all orders (Admin)
export const useAdminOrders = () => {
  return useQuery<AdminOrderItem[]>({
    queryKey: ["admin-orders"],
    queryFn: fetchAllOrders,
  });
};


export const useAdminOrder = (order_id: number | null) => {
  return useQuery<AdminOrderItem>({
    queryKey: ["admin-order", order_id],
    queryFn: () => fetchAdminOrderById(order_id!),
    enabled: !!order_id,
  });
};

// ✅ Update order status (Admin)
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ order_id, data }: { order_id: number; data: UpdateOrderStatusPayload }) =>
      updateOrderStatus(order_id, data),
    onSuccess: () => {
      toast.success("Order status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update order status");
    },
  });
};

// ✅ Cancel order (Admin)
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order_id: number) => cancelOrder(order_id),
    onSuccess: () => {
      toast.success("Order canceled successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to cancel order");
    },
  });
};


// ✅ Delete order (Admin)
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order_id: number) => deleteOrder(order_id),
    onSuccess: () => {
      toast.success("Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to delete order");
    },
  });
};


// ===============================
// 👤 USER, ADMIN & SUPERADMIN HOOKS
// ===============================



// ✅ Fetch all users (Superadmin only)
export const useUsers = () => {
  return useQuery<AppUser[]>({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });
};

// ✅ Fetch single user by ID
export const useUser = (user_id: number | null) => {
  return useQuery<AppUser>({
    queryKey: ["user", user_id],
    queryFn: () => fetchUserById(user_id!),
    enabled: !!user_id,
  });
};

// ✅ Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user_id, data }: { user_id: number; data: UpdateUserPayload }) =>
      updateUser(user_id, data),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update user");
    },
  });
};

// ✅ Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user_id: number) => deleteUser(user_id),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to delete user");
    },
  });
};

// ✅ Fetch all admins (Superadmin only)
export const useAdmins = () => {
  return useQuery<AppUser[]>({
    queryKey: ["admins"],
    queryFn: fetchAllAdmins,
  });
};

// ✅ Create new admin (Superadmin only)
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { username: string; email: string; password: string }) => createAdmin(data),
    onSuccess: () => {
      toast.success("Admin created successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to create admin");
    },
  });
};

// ✅ Delete admin (Superadmin only)
export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (admin_id: number) => deleteAdmin(admin_id),
    onSuccess: () => {
      toast.success("Admin deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to delete admin");
    },
  });
};

// ✅ Update superadmin settings
export const useUpdateSuperadminSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserPayload) => updateSuperadminSettings(data),
    onSuccess: () => {
      toast.success("Superadmin settings updated");
      queryClient.invalidateQueries({ queryKey: ["superadmin-settings"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update settings");
    },
  });
};

// ✅ Update user role (Superadmin only)
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user_id, new_role }: { user_id: number; new_role: "user" | "admin" | "superadmin" }) =>
      updateUserRole(user_id, new_role),
    onSuccess: () => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update user role");
    },
  });
};






export const useWishlist = (user_id: number | null) => {
  return useQuery<Wishlist[]>({
    queryKey: ["wishlist", user_id],
    queryFn: () => fetchUserWishlist(user_id!),
    enabled: !!user_id,
  });
};

export const useAddWishlistItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WishlistCreatePayload) => createWishlistItem(data),
    onSuccess: () => {
      toast.success("Added to wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => {
      toast.error("Failed to add to wishlist");
    },
  });
};

export const useDeleteWishlistItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (wishlist_id: number) => deleteWishlistItem(wishlist_id),
    onSuccess: () => {
      toast.success("Removed from wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => toast.error("Failed to remove item from wishlist"),
  });
};
