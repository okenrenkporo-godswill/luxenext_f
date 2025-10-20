"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Tag,
  Package,
  ShoppingCart,
  CreditCard,
  Ticket,
  Users,
  MessageSquare,
  Settings,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import OrdersTable from "./OrderAdmin";
import OrderDetail from "./OrderSingle";
import CategoryPanel from "./CategoryAdmin";
import ProductAdmin from "./ProductAdmin";
import Dashboard from "./Dashboard";
import User from "./User";


const nav = [
  { label: "Dashboard", icon: Home },
  { label: "Category", icon: Tag },
  { label: "Products", icon: Package },
  { label: "Orders", icon: ShoppingCart },

  { label: "Coupon", icon: Ticket },
  { label: "Users", icon: Users },
  { label: "Review", icon: MessageSquare },
  { label: "Settings", icon: Settings },
];

export default function AdminPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Content for each section
// Content for each section
const renderContent = () => {
  switch (selected) {
    case "Dashboard":
      return (
        <Card title="Dashboard Overview">
          <Dashboard />
        </Card>
      );

    case "Category":
      return (
        <Card title="Category Management">
          <CategoryPanel />
        </Card>
      );

    case "Products":
      return (
        <Card title="Products Management">
          <ProductAdmin />
        </Card>
      );

    case "Orders":
      return (
        <div className="flex-1">
          <Card title="Orders Management">
            {selectedOrderId ? (
              <OrderDetail
                orderId={selectedOrderId}
                onBack={() => setSelectedOrderId(null)}
              />
            ) : (
              <OrdersTable onSelectOrder={(id) => setSelectedOrderId(id)} />
            )}
          </Card>
        </div>
      );

    case "Payment":
      return (
        <Card title="Payment Records">
          <p>Monitor and verify payment transactions.</p>
        </Card>
      );

    case "Coupon":
      return (
        <Card title="Coupon Management">
          <p>Create and manage promotional coupons and discounts.</p>
        </Card>
      );

    case "Users":
      return (
        <Card title="User Management">
          <div>
            <p className="mb-3">Manage customer accounts and admin roles.</p>
            <User />
          </div>
        </Card>
      );

    case "Review":
      return (
        <Card title="Customer Reviews">
          <p>Read and moderate customer feedback and reviews.</p>
        </Card>
      );

    case "Settings":
      return (
        <Card title="Settings">
          <p>Update admin preferences, notifications, and themes.</p>
        </Card>
      );

    default:
      return null;
  }
};


  return (
    <div className="min-h-screen flex bg-[#f9fafb] text-gray-800">
      {/* Toggle Button (Mobile) */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#0f1724] text-gray-100 p-2 rounded-md shadow-md"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar (Mobile) */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="sidebar"
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-64 min-h-screen bg-[#0f1724] text-gray-300 p-6 flex flex-col justify-between z-40 lg:relative lg:translate-x-0"
          >
            <SidebarContent
              selected={selected}
              setSelected={setSelected}
              closeSidebar={() => setOpen(false)}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 overflow-y-auto bg-[#0f1724] text-gray-300 p-6 flex flex-col justify-between">
        <SidebarContent selected={selected} setSelected={setSelected} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected + selectedOrderId} // change key when switching between table/detail
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Sidebar Content Component
function SidebarContent({
  selected,
  setSelected,
  closeSidebar,
}: {
  selected: string;
  setSelected: (s: string) => void;
  closeSidebar?: () => void;
}) {
  return (
    <>
      <div>
        {/* Brand */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center text-white font-bold">
            L
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">LuxeNext</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = selected === n.label;
            return (
              <motion.div
                key={n.label}
                whileHover={{ x: 6 }}
                className={`rounded-md cursor-pointer ${
                  active ? "bg-[#1d2a3b]" : ""
                }`}
                onClick={() => {
                  setSelected(n.label);
                  closeSidebar?.();
                }}
              >
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                    active
                      ? "text-white"
                      : "text-gray-300 hover:bg-[#11202f]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{n.label}</span>
                </div>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* User Info */}
      <div className="mt-8">
        <div className="bg-[#0b1620] p-3 rounded-lg flex items-center gap-3">
          <Image
            src="/avatar-placeholder.png"
            alt="avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <p className="text-white font-medium text-sm">Kristin Watson</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </>
  );
}

// Card Component (for cleaner content)
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">{title}</h2>
      <div className="text-gray-600 text-sm">{children}</div>
    </div>
  );
}
