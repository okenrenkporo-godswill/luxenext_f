import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizeServerItem = (si: any) => {
  const productId = si.product_id ?? si.productId ?? si.product?.id ?? 0;
  const name = si.name ?? si.product?.name ?? "Unknown product";
  const price = Number(si.price ?? si.product?.price ?? 0) || 0;
  const quantity = Number(si.quantity ?? si.qty ?? 1) || 1;
  const image = si.image ?? si.product?.image ?? "";
  return { product_id: productId, name, price, quantity, image, id: si.id };
};
export const localStorageAdapter = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return Promise.resolve(null);
    const value = localStorage.getItem(name);
    return value ? Promise.resolve(JSON.parse(value)) : Promise.resolve(null);
  },
  setItem: (name: string, value: any) => {
    if (typeof window === "undefined") return Promise.resolve();
    localStorage.setItem(name, JSON.stringify(value));
    return Promise.resolve();
  },
  removeItem: (name: string) => {
    if (typeof window === "undefined") return Promise.resolve();
    localStorage.removeItem(name);
    return Promise.resolve();
  },
};
