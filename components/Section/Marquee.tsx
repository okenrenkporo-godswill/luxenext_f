"use client";

import React from "react";

export default function Marquee() {
  return (
    <div className="w-full overflow-hidden bg-black py-2">
      <div className="animate-marquee whitespace-nowrap text-white text-lg font-semibold">
        LuxeNest Store — The biggest brand around the world ✨ | Shop from us today 🛒
      </div>
    </div>
  );
}
