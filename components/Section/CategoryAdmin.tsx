"use client";

import { useState } from "react";
import { useCategoriesAdmin, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hook/queries";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ChevronRight,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CategoryPanel() {
  const { data: categories = [], isLoading } = useCategoriesAdmin();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: { name, description } }, {
        onSuccess: () => setShowModal(false)
      });
    } else {
      createMutation.mutate({ name, description }, {
        onSuccess: () => setShowModal(false)
      });
    }
    setName("");
    setDescription("");
    setEditingId(null);
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
    setShowModal(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">Organize your products into logical groups</p>
        </div>
        <Button 
          onClick={() => {
            setEditingId(null);
            setName("");
            setDescription("");
            setShowModal(true);
          }} 
          className="bg-[#0e4b31] hover:bg-[#0a3825] text-white rounded-2xl flex items-center gap-2 px-6 shadow-lg shadow-green-100"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#0e4b31]/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Category Info</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Description</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Products</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-8 py-6"><div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div></td>
                    <td className="px-8 py-6"><div className="h-4 w-48 bg-gray-100 rounded animate-pulse"></div></td>
                    <td className="px-8 py-6"><div className="h-4 w-12 bg-gray-100 rounded animate-pulse"></div></td>
                    <td className="px-8 py-6 text-right"><div className="h-4 w-8 bg-gray-100 rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#0e4b31]/5 flex items-center justify-center text-[#0e4b31]">
                        <LayoutGrid className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ID: #{cat.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-gray-500 max-w-xs truncate">{cat.description || "No description provided."}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold">24 items</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(cat)}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteMutation.mutate(cat.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-300 hover:text-gray-900 rounded-xl transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-8 text-center text-gray-800">
              <div className="w-16 h-16 bg-[#0e4b31]/10 rounded-[1.5rem] flex items-center justify-center text-[#0e4b31] mx-auto mb-4">
                <Plus className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">{editingId ? "Edit Category" : "New Category"}</h2>
              <p className="text-sm text-gray-500 mt-1">Refine your catalog organization</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Electronics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-[#0e4b31]/10 transition-all font-medium"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  placeholder="Short description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-[#0e4b31]/10 transition-all font-medium h-32 resize-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-[#0e4b31] text-white rounded-[1.2rem] text-sm font-bold shadow-lg shadow-green-900/10 hover:bg-[#0a3825] transition-all"
                >
                  {editingId ? "Apply Changes" : "Create Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
