"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Tag,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  Menu,
  X,
  Ticket,
  Search,
  Plus,
  Bell,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import OrdersTable from "./OrderAdmin";
import OrderDetail from "./OrderSingle";
import CategoryPanel from "./CategoryAdmin";
import ProductAdmin from "./ProductAdmin";
import Dashboard from "./Dashboard";
import UserPanel from "./User";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "@/components/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

const navigationGroups = [
  {
    group: "GENERAL",
    items: [
      { label: "Dashboard", icon: Home },
      { label: "Orders", icon: ShoppingCart },
    ],
  },
  {
    group: "CATALOG",
    items: [
      { label: "Products", icon: Package },
      { label: "Category", icon: Tag },
    ],
  },
  {
    group: "CUSTOMERS",
    items: [
      { label: "Users", icon: Users },
      { label: "Review", icon: MessageSquare },
    ],
  },
  {
    group: "SYSTEM",
    items: [
      { label: "Coupon", icon: Ticket },
      { label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const user = useAuthStore((state) => state.user);
  const { isDark } = useTheme();

  const renderContent = () => {
    switch (selected) {
      case "Dashboard":
        return <Dashboard />;
      case "Category":
        return <CategoryPanel />;
      case "Products":
        return <ProductAdmin />;
      case "Orders":
        return selectedOrderId ? (
          <OrderDetail
            orderId={selectedOrderId}
            onBack={() => setSelectedOrderId(null)}
          />
        ) : (
          <OrdersTable onSelectOrder={(id) => setSelectedOrderId(id)} />
        );
      case "Users":
        return <UserPanel />;
      case "Coupon":
      case "Review":
      case "Settings":
        return (
          <div className={`p-12 text-center ${isDark ? "text-gray-400" : "text-gray-400"}`}>
            <h2 className="text-xl font-semibold mb-2">{selected}</h2>
            <p>This feature is coming soon to the Luxenext Admin Terminal.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${
      isDark ? "bg-slate-900 text-gray-100" : "bg-[#f9fafb] text-gray-800"
    }`}>
      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 w-[280px] sm:w-64 h-full z-50 transition-all duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDark ? "bg-slate-950 border-slate-800" : "bg-[#0f172a] border-gray-800"} border-r`}
      >
        <div className="flex flex-col h-full p-4 sm:p-6">
          {/* Close Button (Mobile Only) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-8 sm:mb-10">
            <div className="w-9 h-9 bg-[#0e4b31] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
              </svg>
            </div>
            <h1 className="text-white font-bold text-xl tracking-tight">Luxenext</h1>
          </div>

          {/* Navigation Groups */}
          <nav className="flex-1 space-y-6 sm:space-y-8 overflow-y-auto no-scrollbar -mx-2 px-2">
            {navigationGroups.map((group) => (
              <div key={group.group}>
                <h3 className="text-[10px] font-bold text-gray-500 tracking-[0.2em] mb-3 sm:mb-4 px-1">
                  {group.group}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = selected === item.label;
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          setSelected(item.label);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 sm:py-2.5 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-[#0e4b31] text-white shadow-lg shadow-green-900/20"
                            : "text-gray-400 hover:bg-white/5 hover:text-white active:bg-white/10"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile Footer */}
          <div className={`mt-6 sm:mt-8 pt-4 sm:pt-6 border-t ${isDark ? "border-slate-800" : "border-gray-800"}`}>
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border-2 border-gray-600 flex-shrink-0">
                 <Image
                    src="/avatar-placeholder.png"
                    alt="User"
                    width={40}
                    height={40}
                  />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.username || "Admin"}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{user?.role || "Manager"}</p>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Top Header */}
        <header className={`h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300 ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"
        } border-b`}>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDark ? "text-gray-400 hover:bg-slate-700" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search Bar */}
            <div className="relative hidden md:block w-56 lg:w-72">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
              <input
                type="text"
                placeholder="Search everything..."
                className={`w-full pl-10 pr-4 py-2 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#0e4b31]/20 transition-all ${
                  isDark 
                    ? "bg-slate-700 text-gray-100 placeholder:text-gray-500" 
                    : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                }`}
              />
              <div className={`absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono hidden lg:block ${
                isDark ? "border-slate-600 text-gray-500" : "border-gray-200 text-gray-400"
              } border`}>
                ⌘F
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            <button className={`p-2 rounded-xl transition-colors relative ${
              isDark ? "text-gray-400 hover:bg-slate-700" : "text-gray-500 hover:bg-gray-100"
            }`}>
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></div>
            </button>
            <button className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-[#0e4b31] text-white rounded-xl text-sm font-semibold shadow-md shadow-green-100/20 hover:bg-[#0a3825] transition-all ml-1 sm:ml-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 no-scrollbar transition-colors duration-300 ${
          isDark ? "bg-slate-900" : "bg-[#f9fafb]"
        }`}>
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected + selectedOrderId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

