import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://luxenext.onrender.com";


const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor: attach token
apiClient.interceptors.request.use((config) => {
  // Skip adding token for auth-related endpoints to avoid backend confusion with old tokens
  const publicPaths = ["/auth/login", "/auth/register", "/auth/verify"];
  const isPublicPath = publicPaths.some(path => config.url?.includes(path));

  if (!isPublicPath) {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { logout, _hasHydrated, token } = useAuthStore.getState();

      // Get the token actually used in THIS request
      const authHeader = error.config?.headers?.Authorization;
      const requestToken = typeof authHeader === 'string' ? authHeader.split(" ")[1] : null;

      // ONLY trigger logout if we have a current session AND the request was using that exact token.
      // This critical check stops stale requests from previous sessions from logging out a fresh session.
      if (_hasHydrated && token && requestToken === token) {
        console.warn("Current session token is invalid or expired. Logging out...");

        logout();

        if (typeof window !== "undefined") {
          try {
            // Clear backend cookie via API route
            await fetch("/api/auth/logout", { method: "POST" });

            // Safe redirect to login with original destination preserved
            if (!window.location.pathname.startsWith("/login")) {
              window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
            }
          } catch (e) {
            console.error("Auth cleanup failed", e);
          }
        }
      } else if (token && !requestToken) {
        // Log it but don't logout if the request didn't even have a token (e.g. race condition)
        console.warn("Unauthorized API call (Missing request token). Skipping global logout.");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
