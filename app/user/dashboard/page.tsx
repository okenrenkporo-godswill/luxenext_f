// app/user/dashboard/page.tsx
import dynamic from "next/dynamic";

// Dynamically import DashboardClient as client component (no SSR)
const DashboardClient = dynamic(
  () => import("@/components/Section/DashboardClient"),
  { ssr: false } // <-- important
);

export default function Page() {
  return <DashboardClient />;
}
