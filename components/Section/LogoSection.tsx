"use client";

import Link from "next/link";

export default function LogoSection() {
  return (
    <Link
      href="/"
      className="text-3xl font-extrabold text-green-700 dark:text-indigo-400 transition-transform hover:scale-110"
    >
      LuxeNext
    </Link>
  );
}
