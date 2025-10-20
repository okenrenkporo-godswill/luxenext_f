import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
      // 👇 Optional: if later you serve images from your FastAPI backend
      // {
      //   protocol: "http",
      //   hostname: "localhost",
      //   port: "8000", // change if different
      // },
    ],
  },
};

export default nextConfig;
