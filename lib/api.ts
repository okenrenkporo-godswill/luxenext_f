import apiClient from "./axios";

// ===============================
// ✅ Backend Response Wrapper
// ===============================
interface ApiResponse<T> {
  data: T;
  message: string;
}

// ===============================
// 🛍️ Product & Category Types
// ===============================
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  thumbnail_url?: string;
  category_id: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  total_sales: number;    // total sold items in this category
  total_quantity: number; 
}
// lib/api.ts
export interface SearchOptions {
  category_id?: number;
  min_price?: number;
  max_price?: number;
  sort?: string;
  skip?: number;
  limit?: number;
  category?: string;
  page?: number;   // ✅ Add this
  
}




// ✅ Product API Functions
export async function fetchProducts(): Promise<Product[]> {
  const res = await apiClient.get<ApiResponse<Product[]>>("/products");
  return res.data.data;
}

export async function fetchProductById(id: number | string): Promise<Product> {
  const res = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
  return res.data.data;
}


// Create a product (with optional file upload)
export const createProduct = async (formData: FormData): Promise<Product> => {
  const res = await apiClient.post<ApiResponse<Product>>("/products/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// Update a product (with optional file upload)
export const updateProduct = async (id: number, formData: FormData): Promise<Product> => {
  const res = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// Delete a product
export const deleteProduct = async (id: number): Promise<{ message: string }> => {
  const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/products/${id}`);
  return res.data.data;
};
// lib/api.ts


export const fetchTopProducts = async () => {
  const res = await apiClient.get("products/top");
  return res.data.data;
};

// Search products
export const searchProducts = async (
  q: string,
  options?: { category_id?: number; min_price?: number; max_price?: number; sort?: string; skip?: number; limit?: number }
): Promise<{ data: Product[]; pagination: { skip: number; limit: number; count: number } }> => {
  const res = await apiClient.get("/products/search", { params: { q, ...options } });
  return res.data;
};

// Download product image
export const downloadProductImage = async (product_id: number): Promise<Blob> => {
  const res = await apiClient.get(`/products/download/${product_id}`, { responseType: "blob" });
  return res.data;
};

export async function fetchProductsByCategoryId(categoryId: number | string): Promise<Product[]> {
  const res = await apiClient.get<ApiResponse<Product[]>>(`/categories/${categoryId}/products`);
  return res.data.data;
}

// ✅ Category API Functions
export async function fetchCategories(): Promise<Category[]> {
  const res = await apiClient.get<ApiResponse<Category[]>>("/categories");
  return res.data.data;
}

export const createCategory = async (data: { name: string; description?: string }) => {
  const res = await apiClient.post<ApiResponse<Category>>("/categories", data);
  return res.data.data;
};

export const updateCategory = async (id: number, data: { name?: string; description?: string }) => {
  const res = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
  return res.data.data;
};

export const deleteCategory = async (id: number) => {
  const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/categories/${id}`);
  return res.data.data;
};

// ===============================
// 🛒 Cart Types & Functions
// ===============================
export interface CartItem {
  id?: number;          // backend cart item ID, optional for optimistic updates
  product_id: number;   // actual product ID
  name: string;
  price: number;
  quantity: number;
  image: string;
}


export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CartItemPayload {
  product_id: number;
  quantity: number;
}


export const getCart = async () => {
  try {
    const res = await apiClient.get("/cart/user");
    // Ensure we always return an object with `items` array
    return res.data?.data || { items: [] };
  } catch (err) {
    console.error("Failed to fetch cart:", err);
    // fallback if API fails
    return { items: [] };
  }
};

export const addCartItem = async (item: CartItemPayload) => {
  const res = await apiClient.post("/cart/items", item);
  return res.data.data;
};

export const updateCartItem = async (item_id: number, quantity: number) => {
  const res = await apiClient.put(`/cart/items/${item_id}`, { quantity });
  return res.data.data;
};

export const removeCartItem = async (item_id: number) => {
  const res = await apiClient.delete(`/cart/items/${item_id}`);
  return res.data.data;
};

export const clearCart = async () => {
  const res = await apiClient.delete("/cart/clear");
  return res.data.data;
};
// ===============================
// 💳 Checkout Types & Functions
// ===============================
export interface CheckoutPayload {
  address_id: number;
  payment_method_id: number;
  coupon_ids?: number[];
}

export interface CheckoutResponse {
  id: number;
  order_reference: string;
  status: string;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  address: {
    city: string;
    state: string;
    country: string;
    postal_code: string;
  } | null;
}

export const checkoutCart = async (data: CheckoutPayload): Promise<CheckoutResponse> => {
  const res = await apiClient.post<ApiResponse<CheckoutResponse>>("/orders/checkout", data);
  return res.data.data;
};

// ===============================
// 🏠 Address Types & Functions
// ===============================
export interface Address {
  id: number;
  address_line: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone_number: string;
  created_at?: string;
}

export interface AddressPayload {
  address_line: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone_number: string;
}

export const fetchAddresses = async (): Promise<Address[]> => {
  const res = await apiClient.get<ApiResponse<Address[]>>("/addresses");
  return res.data.data;
};

export const fetchAddressById = async (address_id: number): Promise<Address> => {
  const res = await apiClient.get<ApiResponse<Address>>(`/addresses/${address_id}`);
  return res.data.data;
};

export const createAddress = async (data: AddressPayload): Promise<Address> => {
  const res = await apiClient.post<ApiResponse<Address>>("/addresses", data);
  return res.data.data;
};

export const updateAddress = async (address_id: number, data: Partial<AddressPayload>): Promise<Address> => {
  const res = await apiClient.put<ApiResponse<Address>>(`/addresses/${address_id}`, data);
  return res.data.data;
};

export const deleteAddress = async (address_id: number): Promise<Address> => {
  const res = await apiClient.delete<ApiResponse<Address>>(`/addresses/${address_id}`);
  return res.data.data;
};

// ===============================
// 💳 Payment Types & Functions
// ===============================
export interface PaymentMethod {
  id: number;
  name: string;
  provider: string;
  account_number?: string | null;
}

export const fetchPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const res = await apiClient.get<PaymentMethod[]>("/payment/payment-methods");
  return res.data;
};

export const confirmManualPayment = async (order_id: number) => {
  const res = await apiClient.post(`/payment/orders/${order_id}/confirm-payment`);
  return res.data.data;
};

export const rejectManualPayment = async (order_id: number, reason: string) => {
  const res = await apiClient.post(`/payment/orders/${order_id}/reject-payment`, { reason });
  return res.data.data;
};

// ===============================
// 🧾 User Orders Types & Functions
// ===============================
export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  image?: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface OrderResponse {
  id: number;
  order_reference: string;
  status: string;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
  user: User;
  address: {
    id?: number;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  } | null;
}

export interface OrderHistoryItem {
  id: number;
  order_reference: string;
  status: string;
  payment_status: string;
  total_amount: number;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

export const fetchUserOrders = async (): Promise<OrderHistoryItem[]> => {
  const res = await apiClient.get<ApiResponse<OrderHistoryItem[]>>("/orders/user");
  return res.data.data;
};

export const fetchOrderById = async (order_id: number): Promise<OrderResponse> => {
  const res = await apiClient.get<ApiResponse<OrderResponse>>(`/orders/${order_id}`);
  return res.data.data;
};

// ===============================
// 🧾 Admin Orders Types & Functions
// ===============================
export interface AdminOrderItem {
  id: number;
  order_reference: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  items: {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
  }[];
}

export interface UpdateOrderStatusPayload {
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
}

export const fetchAllOrders = async (): Promise<AdminOrderItem[]> => {
  const res = await apiClient.get<ApiResponse<AdminOrderItem[]>>("/orders");
  return res.data.data;
};

export const fetchAdminOrderById = async (order_id: number): Promise<AdminOrderItem> => {
  const res = await apiClient.get<ApiResponse<AdminOrderItem>>(`/orders/${order_id}`);
  return res.data.data;
};

export const updateOrderStatus = async (order_id: number, data: UpdateOrderStatusPayload): Promise<AdminOrderItem> => {
  const res = await apiClient.put<ApiResponse<AdminOrderItem>>(`/orders/${order_id}/status`, data);
  return res.data.data;
};

export const cancelOrder = async (order_id: number): Promise<AdminOrderItem> => {
  const res = await apiClient.put<ApiResponse<AdminOrderItem>>(`/orders/${order_id}/cancel`);
  return res.data.data;
};
 export const deleteOrder = async (order_id: number): Promise<{ message: string }> => {
  const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/orders/${order_id}`);
  return res.data.data;
}

export const formatError = (err: any) => {
  if (!err) return "Something went wrong";
  const detail = err?.response?.data?.detail;
  if (!detail) return err.message || "Something went wrong";
  if (Array.isArray(detail)) return detail.map(d => d.msg).join(", ");
  if (typeof detail === "object") return JSON.stringify(detail);
  return String(detail);
};

// ===============================
// 👤 User & Admin Management
// ===============================

export interface AppUser {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  is_verified: boolean;
  created_at: string;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  password?: string;
}

// ✅ Get all users (superadmin only)
export const fetchAllUsers = async (): Promise<AppUser[]> => {
  const res = await apiClient.get<ApiResponse<AppUser[]>>("/users");
  return res.data.data;
};

// ✅ Get single user by ID
export const fetchUserById = async (user_id: number): Promise<AppUser> => {
  const res = await apiClient.get<ApiResponse<AppUser>>(`/users/${user_id}`);
  return res.data.data;
};

// ✅ Update user (superadmin only)
export const updateUser = async (user_id: number, data: UpdateUserPayload): Promise<AppUser> => {
  const res = await apiClient.put<ApiResponse<AppUser>>(`/users/${user_id}`, data);
  return res.data.data;
};

// ✅ Delete user (superadmin only)
export const deleteUser = async (user_id: number): Promise<{ message: string }> => {
  const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/users/${user_id}`);
  return res.data.data;
};

// ✅ Update superadmin's own settings
export const updateSuperadminSettings = async (data: UpdateUserPayload): Promise<AppUser> => {
  const res = await apiClient.put<ApiResponse<AppUser>>("/users/settings", data);
  return res.data.data;
};

// ✅ Create admin (superadmin only)
export const createAdmin = async (data: { username: string; email: string; password: string }): Promise<AppUser> => {
  const res = await apiClient.post<ApiResponse<AppUser>>("/auth/create-admin", data);
  return res.data.data;
};

// ✅ Delete admin (superadmin only)
export const deleteAdmin = async (admin_id: number): Promise<{ message: string }> => {
  const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/auth/delete-admin/${admin_id}`);
  return res.data.data;
};

// ✅ Get all admins (superadmin only)
export const fetchAllAdmins = async (): Promise<AppUser[]> => {
  const res = await apiClient.get<ApiResponse<AppUser[]>>("/auth/admins");
  return res.data.data;
};

// ✅ Update user role (superadmin only)
export const updateUserRole = async (user_id: number, new_role: "user" | "admin" | "superadmin"): Promise<AppUser> => {
  const res = await apiClient.put<ApiResponse<AppUser>>(`/auth/${user_id}/role`, { new_role });
  return res.data.data;
};

export interface Wishlist {
  id: number;
  user_id: number;
  product_id: number;
  product: Product;
  created_at: string;
}

export interface WishlistCreatePayload {
  user_id: number;
  product_id: number;
}

// Get all wishlist items for a user
export const fetchUserWishlist = async (user_id: number): Promise<Wishlist[]> => {
  const res = await apiClient.get<ApiResponse<Wishlist[]>>(`/wishlist/user/${user_id}`);
  return res.data.data;
};

// Get a single wishlist item by ID
export const fetchWishlistById = async (wishlist_id: number): Promise<Wishlist> => {
  const res = await apiClient.get<ApiResponse<Wishlist>>(`/wishlist/${wishlist_id}`);
  return res.data.data;
};

// Add item to wishlist
export const createWishlistItem = async (data: WishlistCreatePayload): Promise<Wishlist> => {
  const res = await apiClient.post<ApiResponse<Wishlist>>(`/wishlist/`, data);
  return res.data.data;
};

// Delete wishlist item
export const deleteWishlistItem = async (wishlist_id: number): Promise<{ message: string }> => {
  const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/wishlist/${wishlist_id}`);
  return res.data.data;
};
