"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import HomePage from "@/components/Section/HomePage";
import MobileHome from "@/components/MobileSection/MobileHome";
import { useIsMobile } from "@/lib/mobile";

const DashboardClient = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const searchParams = useSearchParams();
  const mobile = useIsMobile();
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);
  const [hydrated, setHydrated] = useState(false); // track hydration

  // ✅ Ensure client has hydrated before checking token
  useEffect(() => {
    setHydrated(true);
  }, []);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (hydrated && !authStore.token) {
      router.replace("/login");
    }
  }, [hydrated, authStore.token, router]);

  // ✅ Show email verified message
  useEffect(() => {
    if (searchParams?.get("verified") === "success") {
      setShowVerifiedMessage(true);
      const timer = setTimeout(() => setShowVerifiedMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!hydrated || !authStore.token) return null; // prevent flicker

  return (
    <div className="relative">
      {showVerifiedMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          ✅ Your email has been verified!
        </div>
      )}
      {mobile ? <MobileHome /> : <HomePage />}
    </div>
  );
};

export default DashboardClient;
