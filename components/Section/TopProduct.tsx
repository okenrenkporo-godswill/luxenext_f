"use client";

const data = [
  { name: "Prodotti per il tuo cane", review: 4.7, sold: 120, profit: "$16,960" },
  { name: "Wholesome Pride", review: 4.7, sold: 120, profit: "$16,960" },
  { name: "Beneuf Baked Delights", review: 4.7, sold: 120, profit: "$16,960" },
  { name: "Taste of the Wild", review: 4.7, sold: 120, profit: "$16,960" },
  { name: "Canagan - Britain's", review: 4.7, sold: 120, profit: "$16,960" },
];

export default function TopProducts() {
  return (
    <div className="bg-[#0b1620] rounded-lg p-4">
      <h3 className="text-sm text-gray-300 mb-3">Top product</h3>
      <ul className="space-y-3">
        {data.map((d, i) => (
          <li key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#081018] rounded-md flex items-center justify-center text-xs text-gray-400">img</div>
              <div>
                <div className="text-sm text-white">{d.name}</div>
                <div className="text-xs text-gray-400">⭐ {d.review} · {d.sold} sold</div>
              </div>
            </div>
            <div className="text-sm text-gray-300">{d.profit}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
