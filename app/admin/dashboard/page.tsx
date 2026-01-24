"use client";

import SideBar from "@/components/Section/SideBar";
import { ThemeProvider } from "@/components/ThemeContext";
import React from "react";

const AdminPage = () => {
  return (
    <ThemeProvider>
      <SideBar />
    </ThemeProvider>
  );
};

export default AdminPage;
