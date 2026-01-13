"use client";

import Link from "next/link";

interface MenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function Menu({ menuOpen }: MenuProps) {


  return (
    <>
      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-8 items-center">
        {/* Products Dropdown */}
        <li className="relative group">
          <Link
            href="/product"
            className="hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold transition"
          >
            Products
          </Link>
          
        </li>

        {/* Categories Dropdown */}
        <li className="relative group">
          <Link
            href="/categories"
            className="hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold transition"
          >
            Categories
          </Link>
         
        </li>

        <li>
          <Link
            href="/collections"
            className="hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold transition"
          >
            Collections
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold transition"
          >
            Contact
          </Link>
        </li>
      </ul>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white dark:bg-gray-900 border-t overflow-hidden transition-max-height duration-500 ${
          menuOpen ? "max-h-[600px]" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col p-4 gap-4">
          <li>
            <Link
              href="/products"
              className="font-semibold hover:text-indigo-500 dark:hover:text-indigo-300 transition"
            >
              Products
            </Link>
            
          </li>

          <li>
            <Link
              href="/categories"
              className="font-semibold hover:text-indigo-500 dark:hover:text-indigo-300 transition"
            >
              Categories
            </Link>
            
          </li>

          <li>
            <Link
              href="/collections"
              className="hover:text-indigo-500 dark:hover:text-indigo-300 transition"
            >
              Collections
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="hover:text-indigo-500 dark:hover:text-indigo-300 transition"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
