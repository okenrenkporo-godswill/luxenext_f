"use client";

import React from "react";
import HeroImage from "./HeroImage";
import MobileCategories from "./MobileCategories";
import MobileTopDeals from "./MobileTopDeals";
import Message from "../Section/Message";
import MobileProductList from "./MobileProduct";
import MobileNav from "./MobileNav";

export default function MobileHome() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20">
      {/* Hero Section */}
      <HeroImage />

      {/* Categories & Top Deals */}
      <section className="mt-8 px-3 space-y-6">
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
