import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, useCartStore } from "./useCartStore";

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
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  login: (user: User, token: string, serverCart?: CartItem[]) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

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
      name: "auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage), // use standard storage
      partialize: (state) => ({ user: state.user, token: state.token }), // only persist user & token
      onRehydrateStorage: (state) => {
        return () => {
          state.setHasHydrated(true);
        };
      },
    }
  )
);
