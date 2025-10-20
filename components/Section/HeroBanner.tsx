"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroBanner() {
  const swiperRef = useRef<any>(null);
  const IMAGE_DELAY = 10000; // 10 seconds

  const handleVideoPlay = () => swiperRef.current?.autoplay.stop();
  const handleVideoEnd = () => {
    swiperRef.current?.slideNext();
    swiperRef.current?.autoplay.start();
  };

  const SlideCard = ({
    title,
    subtitle,
    buttonText,
    imageSrc,
    isVideo = false,
    videoSrc,
  }: {
    title: string;
    subtitle: string;
    buttonText: string;
    imageSrc?: string;
    isVideo?: boolean;
    videoSrc?: string;
  }) => (
    <div className="flex justify-center items-center h-full px-4 md:px-10">
      <Card className="flex flex-col md:flex-row w-full max-w-5xl h-96 md:h-80 shadow-2xl bg-green-900 text-white overflow-hidden animate-fade-in">
        {/* Left side: Text */}
        <div className="flex-1 flex flex-col justify-center p-6 md:p-16 space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold">{title}</h1>
          <p className="text-lg md:text-xl">{subtitle}</p>
          <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
            {buttonText}
          </Button>
        </div>

        {/* Right side: Image or Video */}
        <div className="flex-1 relative w-full h-64 md:h-auto">
          {isVideo && videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              onPlay={handleVideoPlay}
              onEnded={handleVideoEnd}
            />
          ) : (
            imageSrc && (
              <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-cover"
              />
            )
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <section className="relative w-full overflow-hidden bg-gray-100 pt-[56px] md:pt-[80px]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        loop
        pagination={{ clickable: true }}
        navigation
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        autoplay={{ delay: IMAGE_DELAY, disableOnInteraction: false }}
        className="relative z-20 h-full py-10"
      >
        <SwiperSlide>
          <SlideCard
            title="Welcome to LuxeNext"
            subtitle="Your one-stop shop for fashion, gadgets, food & more."
            buttonText="Start Shopping"
            isVideo
            videoSrc="/videos/banner.mp4"
          />
        </SwiperSlide>

        <SwiperSlide>
          <SlideCard
            title="Latest Smartphones"
            subtitle="Explore the best in mobile technology at unbeatable prices."
            buttonText="Shop Phones"
            isVideo
            videoSrc="/iphone.mp4"
          />
        </SwiperSlide>

        <SwiperSlide>
          <SlideCard
            title="Luxe Fashion Week"
            subtitle="Step into the latest trends and redefine your style."
            buttonText="Shop Fashion"
            imageSrc="/fasion.jpg"
          />
        </SwiperSlide>

        <SwiperSlide>
          <SlideCard
            title="Fresh & Tasty"
            subtitle="From groceries to gourmet – we’ve got your cravings covered."
            buttonText="Order Now"
            imageSrc="/food.jpg"
          />
        </SwiperSlide>

        <SwiperSlide>
          <SlideCard
            title="Luxe Lifestyle"
            subtitle="Tech, gadgets & lifestyle products that inspire."
            buttonText="Discover More"
            imageSrc="/headphone.avif"
          />
        </SwiperSlide>
      </Swiper>

      {/* Two promotional images below the slider */}
      <div className="flex flex-col md:flex-row gap-4 mt-8 max-w-5xl mx-auto px-4">
        {/* Promo Card 1 */}
        <div className="relative flex-1 h-64 md:h-80 rounded-xl overflow-hidden shadow-lg group">
          <Image
            src="/vacation.png"
            alt="Promo 1"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end items-center text-white p-4 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <h2 className="text-2xl md:text-3xl font-bold">
              Welcome to LuxeNext
            </h2>
            <p className="mt-2 text-md md:text-lg">
              Check out our exclusive offers for you!
            </p>
            <button className="mt-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg shadow-lg text-white">
              Shop Now
            </button>
          </div>
        </div>

        {/* Promo Card 2 */}
        <div className="relative flex-1 h-64 md:h-80 rounded-xl overflow-hidden shadow-lg group">
          <Image
            src="/redbike.png"
            alt="Promo 2"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end items-center text-white p-4 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <h2 className="text-2xl md:text-3xl font-bold">LuxeNext Products</h2>
            <p className="mt-2 text-md md:text-lg">
              Don’t miss out, special offer just for you!
            </p>
            <button className="mt-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg shadow-lg text-white">
              Discover Now
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
