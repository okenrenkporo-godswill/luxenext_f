import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  updateItem: (item: CartItem) => void;
  removeItem: (product_id: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (item) => {
        const existing = get().items.find((i) => i.product_id === item.product_id);
        let newItems;
        if (existing) {
          newItems = get().items.map((i) =>
            i.product_id === item.product_id ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        } else {
          newItems = [...get().items, item];
        }
        set({ items: newItems, total: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0) });
      },

      updateItem: (item) => {
        const newItems = get().items.map((i) => (i.product_id === item.product_id ? item : i));
        set({ items: newItems, total: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0) });
      },

      removeItem: (product_id) => {
        const newItems = get().items.filter((i) => i.product_id !== product_id);
        set({ items: newItems, total: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0) });
      },

      clear: () => set({ items: [], total: 0 }),
    }),
    {
      name: "cart-storage",
      // ✅ Only persist serializable data, exclude functions
      partialize: (state) => ({ items: state.items, total: state.total }),
    }
  )
);
