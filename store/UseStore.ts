import { create } from "zustand";

interface AppState {
  cartItemCount: number;
  wishlistCount: number;
  notificationsCount: number;
  setCartItemCount: (count: number) => void;
  setWishlistCount: (count: number) => void;
  setNotificationsCount: (count: number) => void;
}

export const useStore = create<AppState>((set) => ({
  cartItemCount: 0,
  wishlistCount: 0,
  notificationsCount: 0,
  setCartItemCount: (count) => set({ cartItemCount: count }),
  setWishlistCount: (count) => set({ wishlistCount: count }),
  setNotificationsCount: (count) => set({ notificationsCount: count }),
}));
