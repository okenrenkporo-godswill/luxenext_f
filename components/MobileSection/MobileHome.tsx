"use client";

import React from "react";
import HeroImage from "./HeroImage";
import MobileCategories from "./MobileCategories";
import MobileTopDeals from "./MobileTopDeals";
import Message from "../Section/Message";
import MobileProductList from "./MobileProduct";
import MobileNav from "./MobileNav";

import FeatureIcons from "./FeatureIcons";
import { useAuthStore } from "@/store/useAuthStore";

export default function MobileHome() {
  const { user, _hasHydrated } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen flex flex-col bg-white pb-24">
      {/* Hero Section */}
      <HeroImage />

      {/* Greeting Section */}
      {(mounted && _hasHydrated && user) && (
        <div className="px-5 pt-10 -mb-2">
            <div className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-900/40">
                    Premium Member
                </h2>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">
                {getGreeting()}, <br />
                <span className="text-green-800">{user.username}</span> 👋
            </h1>
        </div>
      )}

      {/* Feature Icons Row */}
      <FeatureIcons />

      {/* Categories & Top Deals */}
      <section className="mt-4 px-3 space-y-10">
        <MobileCategories />
        <MobileTopDeals />
      </section>

      {/* Message Section */}
      <section className="mt-6 px-3">
        <Message />
      </section>
      
      <section className="mt-6 px-3">
        <MobileProductList/>
      </section>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 w-full bg-white shadow-inner z-50">
        <MobileNav />
      </div>
    </div>
  );
}
