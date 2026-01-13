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
  (error) => {
    // Only log, don't force logout here to avoid race conditions with hydration
    if (error.response?.status === 401) {
      console.warn("Unauthorized API call");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
