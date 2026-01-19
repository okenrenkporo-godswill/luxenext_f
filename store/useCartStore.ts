import { localStorageAdapter } from "@/lib/utils";
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
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  updateItem: (item: CartItem) => void;
  removeItem: (product_id: number) => void;
  clear: () => void;
  setCart: (items: CartItem[]) => void;
  setOpen: (open: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      isOpen: false,

      setOpen: (isOpen: boolean) => set({ isOpen }),

      setCart: (items: CartItem[]) =>
        set({
          items,
          total: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        }),

      addItem: (item: CartItem) => {
        const existing = get().items.find((i) => i.product_id === item.product_id);
        if (existing) {
          get().updateItem({ ...existing, quantity: existing.quantity + item.quantity });
        } else {
          set((state) => {
            const newItems = [...state.items, item];
            return {
              items: newItems,
              total: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
            };
          });
        }
      },

      updateItem: (item: CartItem) =>
        set((state) => {
          const newItems = state.items.map((i) =>
            i.product_id === item.product_id ? item : i
          );
          return {
            items: newItems,
            total: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
          };
        }),

      removeItem: (product_id: number) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.product_id !== product_id);
          return {
            items: newItems,
            total: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
          };
        }),

      clear: () => set({ items: [], total: 0 }),
    }),
    {
      name: "cart-storage",
      storage: localStorageAdapter,
    }
  )
);
