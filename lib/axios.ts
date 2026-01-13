import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://luxenext.onrender.com";


const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor: attach token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { logout, _hasHydrated } = useAuthStore.getState();

      if (_hasHydrated) {
        console.warn("Session expired or invalid token. Logging out...");

        // 1. Clear Zustand state
        logout();

        // 2. Clear Cookie via API route (if in browser)
        if (typeof window !== "undefined") {
          try {
            await fetch("/api/auth/logout", { method: "POST" });

            // 3. Redirect to login if not already there
            if (!window.location.pathname.startsWith("/login")) {
              window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
            }
          } catch (e) {
            console.error("Cleanup failed", e);
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
