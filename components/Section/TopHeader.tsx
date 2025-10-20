// components/TopHeader.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function TopHeader() {
  const texts = [
    "Free Shipping on Orders Above $50",
    "New Arrivals Just Dropped!",
    "Limited Time Offer: 20% Off",
  ];

  return (
    <div className="bg-gradient-to-r from-green-900 to-green-400 text-white text-sm md:text-base py-1 px-4">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
      >
        {texts.map((text, index) => (
          <SwiperSlide key={index}>
            <p className="text-center md:text-left font-medium">{text}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
