"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative h-screen w-full flex items-center justify-center ">
      {/* Background Image */}
      <Image
        src="/mob.jpg"
        alt="Luxenext Hero"
        fill
        className="object-cover opacity-90"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center text-white px-6"
      >
        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg"
        >
          Luxenext
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl font-semibold text-gray-100 mb-10 max-w-md mx-auto leading-relaxed"
        >
          Discover luxury fashion redefined.<br />
          Step into elegance, sophistication, and timeless style — 
          crafted to make every moment stand out.
        </motion.p>

        {/* Circular Arrow Link */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex justify-center"
        >
          <Link
            href="/mobile" // ← change this to your destination route
            className="p-6 rounded-full border-4 border-white shadow-lg hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: "#163516ff", // inner circle color
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
