"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0B2E13] to-[#1A431F] text-white pt-12 pb-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Top sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/20 pb-8">
          {/* About Us */}
          <div>
            <h3 className="font-bold text-lg mb-3">ABOUT US</h3>
            <ul className="space-y-2 text-gray-100">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Our Collaborations
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-3">CATEGORIES</h3>
            <ul className="space-y-2 text-gray-100">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Tech
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Food
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Lifestyle
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-bold text-lg mb-3">CUSTOMER SUPPORT</h3>
            <p className="text-gray-100">11 AM - 6 AM (Monday - Friday)</p>
            <ul className="space-y-2 mt-2">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="font-bold text-lg mb-3">SUBSCRIBE TO US</h3>
            <p className="text-gray-100 mb-3">
              Sign up using email to get special offers, better discounts, exclusive access, and much more.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 rounded-l-lg w-full text-black focus:outline-none"
              />
              <button className="bg-white text-[#0B2E13] font-bold px-4 py-2 rounded-r-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            <div className="mt-4">
              <label className="text-gray-100 mr-2 font-medium">Country:</label>
              <select className="px-2 py-1 rounded bg-white text-[#0B2E13]">
                <option>United States</option>
                <option>Nigeria</option>
                <option>UK</option>
                <option>Germany</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom: Social & Copyright */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors"><Facebook size={20} /></Link>
            <Link href="#" className="hover:text-white transition-colors"><Instagram size={20} /></Link>
            <Link href="#" className="hover:text-white transition-colors"><Twitter size={20} /></Link>
            <Link href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></Link>
          </div>
          <p className="text-gray-200 text-sm text-center md:text-right mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} LuxeNext. All rights reserved.
          </p>
        </div>

        {/* Big LUXENEXT Write-up */}
        <div className="mt-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-widest">
            LUXENEXT
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200">
            Discover the best in fashion, gadgets, food & lifestyle. Experience LuxeNext today.
          </p>
        </div>
      </div>
    </footer>
  );
}
