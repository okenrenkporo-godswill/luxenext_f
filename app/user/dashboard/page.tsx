// pages/user/dashboard.tsx
"use client";


import MobileHome from "@/components/MobileSection/MobileHome";
import HomePage from "@/components/Section/HomePage";
import { useIsMobile } from "@/hooks/useIsMobile";

const UserDashboardPage = () => {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? <MobileHome /> : <HomePage />}
    </div>
  );
};

export default UserDashboardPage;
