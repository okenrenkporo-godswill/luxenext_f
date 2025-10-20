"use client";
import { useEffect, useState } from "react";

import MobileHome from "@/components/MobileSection/MobileHome";
import HomePage from "@/components/Section/HomePage";
import { isMobile } from "@/lib/mobile";
import Hero from "@/components/MobileSection/Hero";

export default function Page() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
    const handleResize = () => setMobile(isMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <>{mobile ? <Hero /> : <HomePage />}</>;
}
