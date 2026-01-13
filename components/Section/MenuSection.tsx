"use client";

import Link from "next/link";
import { useCategories } from "@/hook/queries";
import { ChevronDown } from "lucide-react";

interface MenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function Menu({ menuOpen }: MenuProps) {
  const { data: categories = [] } = useCategories();


  return (
    <>
      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-8 items-center">
        {/* Products Dropdown */}
        <li className="relative group">
          <Link
            href="/product"
            className="hover:text-green-600 dark:hover:text-green-300 font-semibold transition"
          >
            Products
          </Link>
          
        </li>

        {/* Categories Dropdown */}
        <li className="relative group">
          <Link
            href="/categories"
            className="hover:text-green-600 dark:hover:text-green-300 font-semibold transition flex items-center gap-1"
          >
            Categories
            <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform" />
          </Link>
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 dark:border-gray-700 z-50">
            {categories.length > 0 ? (
              categories.slice(0, 8).map((category: any) => (
                <Link
                  key={category.id}
                  href={`/categories?id=${category.id}`}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-600 transition-colors"
                >
                  {category.name}
                </Link>
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-gray-400">Loading...</p>
            )}
            <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
               <Link href="/categories" className="block px-4 py-2 text-xs font-bold text-green-600 hover:bg-green-50 uppercase tracking-wider">
                  View All Categories
               </Link>
            </div>
          </div>
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
            <div className="flex flex-col gap-2">
              <Link
                href="/categories"
                className="font-semibold hover:text-green-600 dark:hover:text-green-300 transition"
              >
                Categories
              </Link>
               {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 pl-2">
                    {categories.slice(0, 5).map((category: any) => (
                      <Link
                        key={category.id}
                        href={`/categories?id=${category.id}`}
                        className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-300"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
               )}
            </div>
            
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
