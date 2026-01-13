import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://luxenext.onrender.com";


const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor: attach token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const publicPaths = ["/auth/login", "/auth/register", "/auth/verify"];
  const isPublicPath = publicPaths.some(path => config.url?.includes(path));

  const { token, _hasHydrated } = useAuthStore.getState();

  if (!isPublicPath && _hasHydrated && token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});


// Response interceptor: handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log, don't force logout here to avoid race conditions with hydration
    if (error.response?.status === 401) {
      console.warn("Unauthorized API call (401)", error.config.url);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
