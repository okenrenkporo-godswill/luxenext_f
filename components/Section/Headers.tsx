"use client";

import React from "react";
import TopHeader from "./TopHeader";
import Profile from "./Profile";
import NavBar from "@/components/Section/NavBar";
import { useAuthStore } from "@/store/useAuthStore";

const Headers = () => {
  const { user } = useAuthStore(); // ✅ get user from store

  return (
    <div className="relative w-full">
      <TopHeader />

      {/* ✅ If logged in, show Profile only — otherwise show NavBar */}
      {user ? (
        <div className="flex items-center justify-end px-6 py-3 bg-white shadow-sm">
          <Profile />
        </div>
      ) : (
        <NavBar />
      )}
    </div>
  );
};

export default Headers;
