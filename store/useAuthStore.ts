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
  isLoading: boolean;
  login: (user: User, token: string, serverCart?: CartItem[]) => Promise<void>;
  logout: () => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (user, token, serverCart) => {
        set({ isLoading: true });
        try {
          // Save user and token
          set({ user, token });

          // Sync cart if serverCart provided
          if (serverCart && serverCart.length > 0) {
            useCartStore.getState().setCart(serverCart);
          }
        } catch (err) {
          console.error("❌ Failed to login:", err);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null });
        useCartStore.getState().clear();
      },

      isLoggedIn: () => !!get().token,
    }),
    {
      name: "auth-storage", // localStorage key
      storage: localStorageAdapter, // custom localStorage adapter
      partialize: (state) => ({ user: state.user, token: state.token }), // only save user & token
    }
  )
);
