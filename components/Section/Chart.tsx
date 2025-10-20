"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const pieData = [
  { name: "Men Fashion", value: 7432 },
  { name: "Women", value: 5200 },
  { name: "Kids", value: 3200 },
  { name: "Accessory", value: 2100 },
  { name: "Sport Shoes", value: 1600 },
];
const COLORS = ["#23d3ab", "#6b8cff", "#ffd166", "#ff7a7a", "#9ad3ff"];

const barData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 2400 },
  { month: "Mar", revenue: 3000 },
  { month: "Apr", revenue: 5000 },
  { month: "May", revenue: 8000 },
  { month: "Jun", revenue: 12000 },
  { month: "Jul", revenue: 9000 },
  { month: "Aug", revenue: 7000 },
  { month: "Sep", revenue: 4500 },
  { month: "Oct", revenue: 6000 },
];

export function Chart() {
  return (
    <div className="bg-[#0b1620] rounded-lg p-4">
      <h3 className="text-sm text-gray-400 mb-3">Sale by category</h3>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={pieData} innerRadius={60} outerRadius={90} dataKey="value">
              {pieData.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-300">
        {pieData.map((p, i) => (
          <div key={p.name} className="flex items-center gap-2">
            <span style={{ width: 10, height: 10, background: COLORS[i], borderRadius: 4 }} />
            <span>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

