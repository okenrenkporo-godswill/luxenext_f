"use client";

import HomePage from "@/components/Section/HomePage";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const searchParams = useSearchParams();
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "success") {
      setShowVerifiedMessage(true);

      // Hide the message after 3 seconds
      const timer = setTimeout(() => setShowVerifiedMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className="relative">
      {showVerifiedMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          ✅ Your email has been verified!
        </div>
      )}
      <HomePage />
    </div>
  );
};

export default DashboardPage;
