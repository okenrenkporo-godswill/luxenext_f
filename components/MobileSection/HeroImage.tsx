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
                <Image src={slide.src} alt={slide.title} fill className="object-cover object-center scale-105" />
              ) : (
                <video
                  id={`video-${slide.id}`}
                  src={slide.src}
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-105"
                />
              )}
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="text-center w-full"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="inline-block px-4 py-1 mb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">New Collection 2026</span>
                  </motion.div>
                  
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tighter drop-shadow-2xl">
                    {slide.title}
                  </h2>
                  <p className="text-sm md:text-lg text-white/70 mb-8 max-w-xs mx-auto font-medium">
                    {slide.subtitle}
                  </p>
                  
                  <Link
                    href={slide.link}
                    className="inline-flex items-center justify-center bg-white text-black text-sm font-black px-10 py-4 rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.3)] hover:bg-gray-100 hover:scale-105 transition-all duration-300 active:scale-95"
                  >
                    {slide.button}
                  </Link>
                </motion.div>
              </div>
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
