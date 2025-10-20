// store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, useCartStore } from "./useCartStore";
import { localStorageAdapter } from "@/lib/utils";

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_verified: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string, serverCart?: CartItem[]) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  hydrated: boolean; // track hydration
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hydrated: false,
      setHydrated: (value: boolean) => set({ hydrated: value }),

      login: (user, token, serverCart) => {
        set({ user, token });

        // Sync cart if serverCart provided
        if (serverCart && serverCart.length > 0) {
          useCartStore.getState().setCart(serverCart);
        }
      },

      logout: () => {
        set({ user: null, token: null });
        useCartStore.getState().clear();
      },

      isLoggedIn: () => !!get().token,
    }),
    {
      name: "auth-storage",
      storage: localStorageAdapter,
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        // called after hydration
        if (state) state.setHydrated(true);
      },
    }
  )
);
