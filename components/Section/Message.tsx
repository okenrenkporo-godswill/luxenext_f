"use client";

import { isMobile } from "@/lib/mobile";
import React from "react";

export default function Message() {
  const mobile = isMobile();

  const desktopText =
    "Get your unisex streetwear from LuxeNest — Exclusive styles just for you ✨";
  const mobileText =
    "🔥 Swipe through our latest streetwear drops on LuxeNest — Exclusive styles await you! ✨";

  const text = mobile ? mobileText : desktopText;

  return (
    <div className="w-full" style={{ backgroundColor: "rgb(47, 52, 40)" }}>
      {/* Marquee Section */}
      <div className="w-full bg-black py-3">
        <div className="marquee overflow-hidden">
          <div className="marquee-track">
            <span
              className={`marquee-item ${mobile ? "text-lg" : "text-3xl"} font-bold text-green-500`}
            >
              {text}
            </span>
            <span
              className={`marquee-item ${mobile ? "text-lg" : "text-3xl"} font-bold text-green-500`}
            >
              {text}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
