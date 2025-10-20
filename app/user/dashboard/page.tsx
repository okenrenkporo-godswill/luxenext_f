// app/user/dashboard/page.tsx
import React, { Suspense } from "react";
import DashboardClient from "@/components/Section/DashboardClient";

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <DashboardClient />
  </Suspense>
);

export default Page;
