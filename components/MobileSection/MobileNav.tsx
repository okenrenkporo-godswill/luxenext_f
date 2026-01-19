"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Tag, Clock, MessageSquare } from "lucide-react";
import MobileAccount from "./MobileAccount";
import OrderHistoryDrawer from "../Section/OrderHistory";
import { useCartStore } from "@/store/useCartStore";

const navItems = [
  { label: "Home", icon: Home, href: "/mobile" },
  { label: "Product", icon: Tag, href: "/product" },
  { label: "History", icon: Clock }, // opens drawer
  { label: "Chat", icon: MessageSquare }, // opens account drawer
];

export default function MobileNav() {
  const [selected, setSelected] = useState("Home");
  const [accountOpen, setAccountOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const isCartOpen = useCartStore((state) => state.isOpen);

  if (isCartOpen) return null;

  const handleClick = (itemLabel: string) => {
    setSelected(itemLabel);
    if (itemLabel === "Chat") setAccountOpen(true);
    if (itemLabel === "History") setHistoryOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex justify-around p-3 lg:hidden z-50 rounded-[2rem]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = selected === item.label;

          return item.href ? (
            <motion.a
              key={item.label}
              href={item.href}
              onClick={() => handleClick(item.label)}
              className="flex flex-col items-center justify-center cursor-pointer relative px-4"
              whileTap={{ scale: 0.9 }}
            >
              {active && (
                <motion.div 
                  layoutId="indicator"
                  className="absolute -top-1 w-8 h-1 bg-green-700 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className="w-5 h-5 mb-1"
                style={{ color: active ? "#15803d" : "#94a3b8", transition: 'color 0.3s' }}
              />
              <span
                style={{
                  color: active ? "#15803d" : "#94a3b8",
                  fontWeight: active ? "900" : "600",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  transition: 'color 0.3s'
                }}
              >
                {item.label}
              </span>
            </motion.a>
          ) : (
            <motion.div
              key={item.label}
              onClick={() => handleClick(item.label)}
              className="flex flex-col items-center justify-center cursor-pointer relative px-4"
              whileTap={{ scale: 0.9 }}
            >
              {active && (
                <motion.div 
                  layoutId="indicator"
                  className="absolute -top-1 w-8 h-1 bg-green-700 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className="w-5 h-5 mb-1"
                style={{ color: active ? "#15803d" : "#94a3b8", transition: 'color 0.3s' }}
              />
              <span
                style={{
                  color: active ? "#15803d" : "#94a3b8",
                  fontWeight: active ? "900" : "600",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  transition: 'color 0.3s'
                }}
              >
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Account Drawer */}
      <MobileAccount open={accountOpen} setOpen={setAccountOpen} />

      {/* Order History Drawer */}
      <OrderHistoryDrawer open={historyOpen} setOpen={setHistoryOpen} />
    </>
  );
}
