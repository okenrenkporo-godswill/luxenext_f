"use client";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string;
  delta?: string;
  icon?: React.ReactNode; // 
  children?: React.ReactNode;
}

export default function MetricCard({ title, value, delta, children }: MetricCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-[#0b1620] rounded-lg p-4">
      <div className="text-xs text-gray-400">{title}</div>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className="text-2xl text-white font-semibold">{value}</div>
          {delta && <div className="text-xs text-green-400 mt-1">{delta}</div>}
        </div>
        <div>{children}</div>
      </div>
    </motion.div>
  );
}
