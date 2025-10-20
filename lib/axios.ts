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

// Response interceptor: handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — logging out...");
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
