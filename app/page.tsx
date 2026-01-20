import MobileHome from "@/components/MobileSection/MobileHome";
import HomePage from "@/components/Section/HomePage";
import Hero from "@/components/MobileSection/Hero";

export default function Page() {
  return (
    <>
      {/* Mobile View - Hidden on desktop */}
      <div className="block md:hidden">
        <Hero />
      </div>

      {/* Desktop View - Hidden on mobile */}
      <div className="hidden md:block">
        <HomePage />
      </div>
    </>
  );
}
