"use client";

import { Truck, Headset, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On all orders over ₦50k",
  },
  {
    icon: Headset,
    title: "Support 24/7",
    desc: "Dedicated expert team",
  },
  {
    icon: RotateCcw,
    title: "Easy Return",
    desc: "30 days money back",
  },
];

export default function FeatureIcons() {
  return (
    <div className="grid grid-cols-3 gap-2 px-4 py-8 bg-white border-y border-gray-50">
      {features.map((f, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-green-50 transition-colors">
            <f.icon className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
          </div>
          <h3 className="text-[10px] sm:text-xs font-black text-gray-900 uppercase tracking-widest mb-1">{f.title}</h3>
          <p className="text-[8px] sm:text-[10px] text-gray-400 font-medium leading-tight">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
