"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAddresses, useCreateAddress, useDeleteAddress } from "@/hook/queries";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface StepAddressProps {
  onNext: () => void;
}

export default function StepAddress({ onNext }: StepAddressProps) {
  const { data: addresses, isLoading, isError, error } = useAddresses();
  const { mutate: createAddress, isPending } = useCreateAddress();
  const { mutate: deleteAddress, isPending: deleting } = useDeleteAddress();

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

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-48 gap-3">
        <Loader2 className="animate-spin text-green-600 w-8 h-8" />
        <p className="text-sm text-gray-500 font-medium">Loading your addresses...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
        <p className="text-red-700 font-bold mb-2">Failed to load addresses</p>
        <p className="text-red-600/70 text-sm mb-4">
          {(error as any)?.response?.data?.detail || "Your session may have expired. Please try logging in again."}
        </p>
        <Button 
          variant="outline" 
          className="border-red-200 text-red-700 hover:bg-red-100"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Delivery Address</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
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
                selectedId === addr.id ? "border-black bg-gray-50" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{addr.address_line}</p>
                  <p className="text-sm text-gray-500">
                    {addr.city}, {addr.state}, {addr.country}
                  </p>
                  <p className="text-sm text-gray-400">📞 {addr.phone_number}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={deleting}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAddress(addr.id);
                  }}
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-4">
          No saved address yet. Please add one below.
        </p>
      )}

      {/* Add New Address Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-6">
          <input
            name="address_line"
            placeholder="Address"
            onChange={handleChange}
            className="border p-2 rounded-md col-span-2"
            required
          />
          <input
            name="city"
            placeholder="City"
            onChange={handleChange}
            className="border p-2 rounded-md"
            required
          />
          <input
            name="state"
            placeholder="State"
            onChange={handleChange}
            className="border p-2 rounded-md"
            required
          />
          <input
            name="country"
            placeholder="Country"
            onChange={handleChange}
            className="border p-2 rounded-md"
            required
          />
          <input
            name="postal_code"
            placeholder="Postal Code"
            onChange={handleChange}
            className="border p-2 rounded-md"
            required
          />
          <input
            name="phone_number"
            placeholder="Phone Number"
            onChange={handleChange}
            className="border p-2 rounded-md"
            required
          />
          <div className="col-span-2 flex justify-end mt-4">
            <Button type="submit" disabled={isPending}>
              Save Address
            </Button>
          </div>
        </form>
      )}

      {/* Continue Button */}
      {addresses && addresses.length > 0 && (
        <div className="flex justify-end mt-6">
          <Button onClick={handleContinue}>Continue to Payment</Button>
        </div>
      )}
    </div>
  );
}
