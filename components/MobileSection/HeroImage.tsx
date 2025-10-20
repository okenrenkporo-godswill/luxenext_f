"use client";

import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import MobileCart from "../MobileSection/MobileCart";
import { useRouter } from "next/navigation";

export default function HeroImage() {
  const swiperRef = useRef<any>(null);
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const slides = [
    {
      id: 1,
      type: "image",
      src: "/fasion.jpg",
      title: "Luxury Meets Comfort",
      subtitle: "Step into elegance with the latest collection.",
      button: "Shop Women",
      link: "/shop/women",
    },
    {
      id: 2,
      type: "video",
      src: "/iphone.mp4",
      title: "Unveil Your Elegance",
      subtitle: "Experience fashion in motion with Luxenext.",
      button: "Watch Now",
      link: "/collection",
    },
    {
      id: 3,
      type: "image",
      src: "/jordan.png",
      title: "Redefine Your Style",
      subtitle: "Bold looks, timeless confidence.",
      button: "Shop Men",
      link: "/shop/men",
    },
  ];

  useEffect(() => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    const handleSlideChange = () => {
      const activeSlide = slides[swiper.realIndex];

      // Pause all videos first
      slides.forEach((slide) => {
        if (slide.type === "video") {
          const vid = document.getElementById(`video-${slide.id}`) as HTMLVideoElement;
          vid?.pause();
        }
      });

      if (activeSlide.type === "video") {
        const videoElement = document.getElementById(`video-${activeSlide.id}`) as HTMLVideoElement;
        if (videoElement) {
          swiper.autoplay.stop();
          videoElement.currentTime = 0;
          videoElement.play().catch((err) => {
            console.warn("Video play interrupted:", err);
          });
          videoElement.onended = () => swiper.autoplay.start();
        }
      } else {
        // Resume autoplay if not video
        swiper.autoplay.start();
      }
    };

    swiper.on("slideChange", handleSlideChange);

    return () => {
      swiper.off("slideChange", handleSlideChange);
    };
  }, [slides]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full h-[40vh] overflow-hidden">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        navigation={{ nextEl: ".next-btn", prevEl: ".prev-btn" }}
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {slide.type === "image" ? (
                <Image src={slide.src} alt={slide.title} fill className="object-cover object-center" />
              ) : (
                <video
                  id={`video-${slide.id}`}
                  src={slide.src}
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute bottom-20 left-0 w-full text-center text-white px-4"
              >
                <h2 className="text-lg md:text-2xl font-semibold mb-1 drop-shadow-md">{slide.title}</h2>
                <p className="text-xs md:text-sm text-gray-200 mb-3">{slide.subtitle}</p>
                <Link
                  href={slide.link}
                  className="bg-white text-black text-xs md:text-sm font-semibold px-5 py-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300"
                >
                  {slide.button}
                </Link>
                <div className="custom-pagination mt-4 flex justify-center space-x-2"></div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Button className="prev-btn absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md transition">
        ‹
      </Button>
      <Button className="next-btn absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md transition">
        ›
      </Button>

      <MobileCart open={cartOpen} setOpen={setCartOpen} />

      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: white;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: white;
          opacity: 1;
          transform: scale(1.2);
        }
      `}</style>
    </section>
  );
}
