// app/user/dashboard/page.tsx
"use client";

import DashboardClient from "@/components/Section/DashboardClient";
import React from "react";

// Force this page to always render dynamically
export const dynamic = "force-dynamic";

const Page = () => {
  return <DashboardClient />;
};

export default Page;
