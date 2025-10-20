"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Tag, Clock, Settings } from "lucide-react";
import MobileAccount from "./MobileAccount";
import OrderHistoryDrawer from "../Section/OrderHistory";

const navItems = [
  { label: "Home", icon: Home, href: "/mobile" },
  { label: "Product", icon: Tag, href: "/product" },
  { label: "History", icon: Clock }, // opens drawer
  { label: "Account", icon: Settings }, // opens account drawer
];

export default function MobileNav() {
  const [selected, setSelected] = useState("Home");
  const [accountOpen, setAccountOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleClick = (itemLabel: string) => {
    setSelected(itemLabel);
    if (itemLabel === "Account") setAccountOpen(true);
    if (itemLabel === "History") setHistoryOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-0 w-full bg-white shadow-t flex justify-around p-2 lg:hidden z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = selected === item.label;

          return item.href ? (
            <motion.a
              key={item.label}
              href={item.href}
              onClick={() => handleClick(item.label)}
              className="flex flex-col items-center justify-center cursor-pointer"
              whileTap={{ scale: 0.9 }}
            >
              <Icon
                className="w-6 h-6 mb-1"
                style={{ color: active ? "#c86d5d" : "#888", fontWeight: "bold" }}
              />
              <span
                style={{
                  color: active ? "#c86d5d" : "#888",
                  fontWeight: active ? "bold" : "normal",
                  fontSize: "0.75rem",
                }}
              >
                {item.label}
              </span>
            </motion.a>
          ) : (
            <motion.div
              key={item.label}
              onClick={() => handleClick(item.label)}
              className="flex flex-col items-center justify-center cursor-pointer"
              whileTap={{ scale: 0.9 }}
            >
              <Icon
                className="w-6 h-6 mb-1"
                style={{ color: active ? "#c86d5d" : "#888", fontWeight: "bold" }}
              />
              <span
                style={{
                  color: active ? "#c86d5d" : "#888",
                  fontWeight: active ? "bold" : "normal",
                  fontSize: "0.75rem",
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
