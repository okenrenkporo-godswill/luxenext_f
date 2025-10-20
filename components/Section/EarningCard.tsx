"use client";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

const earnings = [
  { name: "revenue", value: 75 },
];

export default function EarningsCard() {
  return (
    <div className="bg-[#0b1620] rounded-lg p-4 flex flex-col items-center">
      <h3 className="text-sm text-gray-300 mb-3">Earnings</h3>
      <div style={{ width: 180, height: 120 }}>
        <ResponsiveContainer>
          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" data={earnings} startAngle={180} endAngle={-180}>
            <RadialBar />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-white text-xl font-semibold">$37,802</div>
      <div className="text-xs text-gray-400">Increased this month</div>
    </div>
  );
}
