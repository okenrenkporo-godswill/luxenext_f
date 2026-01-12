"use client";

import React from "react";
import TopHeader from "./TopHeader";
import Profile from "./Profile";
import NavBar from "@/components/Section/NavBar";
import { useAuthStore } from "@/store/useAuthStore";

const Headers = () => {
  return (
    <div className="relative w-full">
      <TopHeader />
      <NavBar />
    </div>
  );
};

export default Headers;
