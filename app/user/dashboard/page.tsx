import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the client component, disable SSR
const DashboardClient = dynamic(
  () => import("@/components/Section/DashboardClient"),
  { ssr: false }
);

const Page = () => {
  return (
    <div>
      <DashboardClient />
    </div>
  );
};

export default Page;
