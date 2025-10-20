// src/utils/mobile.ts
import { useEffect, useState } from "react";

/**
 * Detect mobile by window width (Client-side only)
 */
export const isMobileClient = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 768; // standard breakpoint for mobile
};

/**
 * Detect mobile by user-agent (Server or Client)
 */
export const isMobileDevice = (userAgent?: string): boolean => {
  if (typeof navigator !== "undefined") {
    userAgent = navigator.userAgent;
  }

  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

  return mobileRegex.test(userAgent || "");
};

/**
 * Combined mobile detection that works for both server & client
 */
export const isMobile = (userAgent?: string): boolean => {
  if (typeof window !== "undefined") {
    return isMobileClient();
  }
  return isMobileDevice(userAgent);
};

/**
 * Hook: reactive mobile detection
 * Listens to window resize and updates automatically
 */
export const useIsMobile = (): boolean => {
  const [mobile, setMobile] = useState(isMobileClient());

  useEffect(() => {
    const handleResize = () => {
      setMobile(isMobileClient());
    };

    window.addEventListener("resize", handleResize);

    // initial check
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return mobile;
};

/**
 * Example helper for Next.js server-side detection
 * (Used inside a server component or layout)
 */
export const detectMobileFromHeaders = (headers: Headers): boolean => {
  const userAgent = headers.get("user-agent") || "";
  return isMobileDevice(userAgent);
};
