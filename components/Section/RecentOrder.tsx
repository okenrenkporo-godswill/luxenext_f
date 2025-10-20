"use client";
import { useState } from "react";

type Order = {
  id: string;
  product: string;
  customer: string;
  productId: string;
  quantity: string;
  price: string;
  status: "Delivered" | "Pending" | "Shipped";
};

const sample: Order[] = new Array(5).fill(null).map((_, i) => ({
  id: `ORD-${1000 + i}`,
  product: `Product ${i + 1}`,
  customer: `${2_672}`,
  productId: `$${Math.floor(Math.random() * 30000) + 120}`,
  quantity: `X${i + 1}`,
  price: `$${(Math.random() * 30000 + 200).toFixed(2)}`,
  status: "Delivered",
}));

export default function RecentOrders() {
  const [page] = useState(1);

  return (
    <div className="bg-[#0b1620] rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-300">Recent orders</h3>
        <div className="text-xs text-gray-400">Showing 5 entries</div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400">
              <th className="pb-3">Product</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Product ID</th>
              <th className="pb-3">Quantity</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {sample.map((o) => (
              <tr key={o.id} className="border-t border-[#0f1724]">
                <td className="py-3">{o.product}</td>
                <td className="py-3">{o.customer}</td>
                <td className="py-3">{o.productId}</td>
                <td className="py-3">{o.quantity}</td>
                <td className="py-3">{o.price}</td>
                <td className="py-3">
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end items-center gap-2 text-sm text-gray-400">
        <button className="px-3 py-1 rounded bg-[#0b1620]">Prev</button>
        <div className="px-3 py-1 bg-[#0b1620] rounded">1</div>
        <button className="px-3 py-1 rounded bg-[#0b1620]">Next</button>
      </div>
    </div>
  );
}
