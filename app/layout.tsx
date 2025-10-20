import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./providers";
import { Toaster } from "@/components/ui/sonner";
import Headers from "@/components/Section/Headers";
import MobileHeader from "@/components/MobileSection/MobileHeader";
import Footer from "@/components/Section/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LuxeNext | Shop Smarter, Live Better",
  description: "A modern e-commerce platform built with Next.js and TailwindCSS",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="w-full h-full scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen flex flex-col bg-white overflow-x-hidden`}
      >
        <Provider>
          {/* ✅ Sticky Header — not nested */}
          <div className="sticky top-0 z-50 bg-white shadow-sm">
            {/* Mobile Header */}
            <div className="block md:hidden">
              <MobileHeader />
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block">
              <Headers />
            </div>
          </div>

          {/* ✅ Main Content — NO WHITE GAP */}
          <main className="flex-1 w-full">
            {children}
          </main>

          {/* ✅ Footer (desktop only) */}
          <footer className="hidden md:block">
            <Footer />
          </footer>

          {/* ✅ Toaster */}
          <Toaster position="top-left" richColors />
        </Provider>
      </body>
    </html>
  );
}
