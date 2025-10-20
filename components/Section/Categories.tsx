"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCategories } from "@/hook/queries";

type CategoriesProps = {
  onCategorySelect?: (category: any) => void;
  layout?: "vertical" | "horizontal";
};

export default function Categories({
  onCategorySelect,
  layout = "vertical",
}: CategoriesProps) {
  const { data: categories = [] } = useCategories();
  const params = useParams();
  const activeCategory = params?.id; // 👈 current category from URL

  if (layout === "vertical") {
    return (
      <div className="w-64 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto px-2 py-4 space-y-4">
        <h2 className="font-bold text-xl mb-2 px-2">Categories</h2>
        <ul className="space-y-3">
          {categories.map((cat) => {
            const isActive = String(cat.id) === activeCategory;
            return (
              <li
                key={cat.id}
                onClick={() => onCategorySelect && onCategorySelect(cat)}
                className="cursor-pointer"
              >
                <Link href={`/categories/${cat.id}`}>
                  <div
                    className={`flex items-center justify-between px-4 py-2 rounded-lg shadow transition-all duration-300 ease-in-out
                      ${
                        isActive
                          ? "bg-red-600 text-white scale-105 shadow-lg"
                          : "bg-green-800 text-white hover:bg-green-700 hover:scale-105 hover:shadow-lg"
                      }`}
                  >
                    {cat.name}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className="flex gap-4">
      {categories.map((cat) => {
        const isActive = String(cat.id) === activeCategory;
        return (
          <Link key={cat.id} href={`/categories/${cat.id}`}>
            <button
              onClick={() => onCategorySelect && onCategorySelect(cat)}
              className={`w-40 h-12 flex items-center justify-center rounded-lg border text-sm font-medium transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? "bg-red-600 text-white border-red-600 scale-105 shadow-lg"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:scale-105 hover:shadow-lg"
                }`}
            >
              {cat.name}
            </button>
          </Link>
        );
      })}
    </div>
  );
}
