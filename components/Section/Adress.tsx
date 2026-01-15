"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAddresses, useCreateAddress, useDeleteAddress } from "@/hook/queries";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface StepAddressProps {
  onNext: () => void;
  collapsed?: boolean;
  onEdit?: () => void;
}

export default function StepAddress({ onNext, collapsed = false, onEdit }: StepAddressProps) {
  const { _hasHydrated, token, logout } = useAuthStore();
  const { data: addresses, isLoading, isError, error } = useAddresses({ enabled: _hasHydrated && !!token });
  const { mutate: createAddress, isPending } = useCreateAddress();
  const { mutate: deleteAddress, isPending: deleting } = useDeleteAddress();
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState({
    address_line: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    phone_number: "",
  });

  // Load selected address from localStorage if exists
  useEffect(() => {
    const savedId = localStorage.getItem("selectedAddressId");
    if (savedId) setSelectedId(Number(savedId));
  }, []);

  // Conditionally show loading if not hydrated yet to prevent firing requests with null tokens
  if (!_hasHydrated || (token && isLoading)) {
    return (
      <div className="flex flex-col justify-center items-center h-20 gap-2">
        <Loader2 className="animate-spin text-green-600 w-5 h-5" />
      </div>
    );
  }

  // --- COLLAPSED VIEW (Summary) ---
  if (collapsed) {
    const selectedAddress = addresses?.find((a) => a.id === selectedId);
    return (
      <div className="flex items-start justify-between">
        {selectedAddress ? (
           <div className="text-sm">
             <p className="font-bold text-gray-800">{selectedAddress.address_line}</p>
             <p className="text-gray-600">{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}</p>
             <p className="text-gray-600">{selectedAddress.country}</p>
             <p className="text-gray-500 mt-1">Phone: {selectedAddress.phone_number}</p>
           </div>
        ) : (
          <p className="text-sm text-red-500">No address selected.</p>
        )}
        
        {onEdit && (
          <Button variant="link" onClick={onEdit} className="text-green-700 font-semibold p-0 h-auto">
            Change
          </Button>
        )}
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAddress(form, {
      onSuccess: () => {
        setShowForm(false);
        toast.success("Address added!");
      },
    });
  };

  const handleSelect = (id: number) => {
    setSelectedId(id);
    localStorage.setItem("selectedAddressId", String(id));
  };

  const handleContinue = () => {
    if (!selectedId) {
      toast.error("Please select an address to continue");
      return;
    }
    onNext();
  };
  
  if (isError) {
    const isAuthError = (error as any)?.response?.status === 401;
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
        <p className="text-red-700 font-bold mb-2">Failed to load addresses</p>
        <p className="text-red-600/70 text-sm mb-6">
          {isAuthError 
            ? "Your security session has expired. Please log in again to continue." 
            : "Something went wrong. Please try again later."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            className="border-red-200 text-red-700 hover:bg-red-100"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
          {isAuthError && (
             <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={async () => {
                   await fetch("/api/auth/logout", { method: "POST" });
                   logout();
                   router.push("/login?redirect=/checkout");
                }}
             >
                Log In Again
             </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium text-gray-500">Your Addresses</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-xs"
        >
          <Plus size={14} />
          Add New
        </Button>
      </div>

      {/* Existing Addresses */}
      {addresses && addresses.length > 0 ? (
        <div className="grid gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => handleSelect(addr.id)}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                selectedId === addr.id ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-green-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{addr.address_line}</p>
                  <p className="text-sm text-gray-500">
                    {addr.city}, {addr.state}, {addr.country}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">📞 {addr.phone_number}</p>
                </div>
                <div className="flex flex-col gap-2">
                   {selectedId === addr.id && <span className="text-xs font-bold text-green-700 bg-white px-2 py-1 rounded-md border border-green-200">Selected</span>}
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deleting}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddress(addr.id);
                      }}
                      className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">
          No saved address yet. Please add one below.
        </p>
      )}

      {/* Add New Address Form */}
      {showForm && (
        <motion.form 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }}
            className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100"
            onSubmit={handleSubmit}
        >
          <div className="col-span-2">
            <h4 className="font-semibold text-sm mb-2">New Address Details</h4>
          </div>
          <input
            name="address_line"
            placeholder="Address Line"
            onChange={handleChange}
            className="border p-2 rounded-lg text-sm col-span-2 focus:ring-2 ring-green-500 outline-none"
            required
          />
          <input
            name="city"
            placeholder="City"
            onChange={handleChange}
            className="border p-2 rounded-lg text-sm focus:ring-2 ring-green-500 outline-none"
            required
          />
          <input
            name="state"
            placeholder="State"
            onChange={handleChange}
            className="border p-2 rounded-lg text-sm focus:ring-2 ring-green-500 outline-none"
            required
          />
          <input
            name="country"
            placeholder="Country"
            onChange={handleChange}
            className="border p-2 rounded-lg text-sm focus:ring-2 ring-green-500 outline-none"
            required
          />
          <input
            name="postal_code"
            placeholder="Postal Code"
            onChange={handleChange}
            className="border p-2 rounded-lg text-sm focus:ring-2 ring-green-500 outline-none"
            required
          />
          <input
            name="phone_number"
            placeholder="Phone Number"
            onChange={handleChange}
            className="border p-2 rounded-lg text-sm focus:ring-2 ring-green-500 outline-none"
            required
          />
          <div className="col-span-2 flex justify-end gap-2 mt-2">
             <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="text-gray-500">Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-green-700 hover:bg-green-800 text-white">
              Save Address
            </Button>
          </div>
        </motion.form>
      )}

      {/* Continue Button */}
      {addresses && addresses.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <Button onClick={handleContinue} className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow-sm">
             Use this address
          </Button>
        </div>
      )}
    </div>
  );
}
