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
  LayoutGrid,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeContext";

export default function CategoryPanel() {
  const { data: categories = [], isLoading } = useCategoriesAdmin();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const { isDark } = useTheme();

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
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Categories</h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Organize your products into logical groups</p>
        </div>
        <Button 
          onClick={() => {
            setEditingId(null);
            setName("");
            setDescription("");
            setShowModal(true);
          }} 
          className="bg-[#0e4b31] hover:bg-[#0a3825] text-white rounded-2xl flex items-center gap-2 px-4 sm:px-6 shadow-lg shadow-green-100/20 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Main Table Card */}
      <div className={`rounded-2xl sm:rounded-[2rem] border shadow-sm overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"
      }`}>
        <div className={`p-4 sm:p-6 lg:p-8 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
          isDark ? "border-slate-700" : "border-gray-50"
        }`}>
          <div className="relative w-full sm:w-72">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
            <input 
              type="text" 
              placeholder="Search categories..."
              className={`w-full pl-10 pr-4 py-2.5 border-none rounded-xl sm:rounded-2xl text-sm focus:ring-2 focus:ring-[#0e4b31]/20 transition-all ${
                isDark ? "bg-slate-700 text-gray-100 placeholder:text-gray-500" : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
              }`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className={`p-2.5 rounded-xl transition-colors ${
              isDark ? "text-gray-500 hover:text-gray-300 hover:bg-slate-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}>
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className={`p-4 border-b ${isDark ? "border-slate-700" : "border-gray-100"}`}>
                <div className={`h-4 w-32 rounded animate-pulse mb-2 ${isDark ? "bg-slate-700" : "bg-gray-100"}`}></div>
                <div className={`h-3 w-48 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-gray-100"}`}></div>
              </div>
            ))
          ) : categories.map((cat) => (
            <div key={cat.id} className={`p-4 border-b last:border-b-0 ${isDark ? "border-slate-700" : "border-gray-100"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-[#0e4b31]/5 text-[#0e4b31]"
                }`}>
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{cat.name}</p>
                  <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>{cat.description || "No description"}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isDark ? "bg-slate-700 text-gray-300" : "bg-gray-100 text-gray-600"
                  }`}>ID: #{cat.id}</span>
                </div>
              </div>
              <div className={`flex items-center gap-2 mt-3 pt-3 border-t border-dashed ${isDark ? "border-slate-700" : "border-gray-100"}`}>
                <button onClick={() => handleEdit(cat)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${
                  isDark ? "text-gray-400 hover:text-amber-400 hover:bg-slate-700" : "text-gray-500 hover:text-amber-600 hover:bg-amber-50"
                }`}>
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button onClick={() => deleteMutation.mutate(cat.id)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${
                  isDark ? "text-gray-400 hover:text-rose-400 hover:bg-slate-700" : "text-gray-500 hover:text-rose-600 hover:bg-rose-50"
                }`}>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className={isDark ? "bg-slate-700/50" : "bg-gray-50/50"}>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Category Info</th>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Description</th>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Products</th>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest text-right ${isDark ? "text-gray-400" : "text-gray-500"}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-gray-50"}`}>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 lg:px-8 py-6"><div className={`h-4 w-32 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-gray-100"}`}></div></td>
                    <td className="px-6 lg:px-8 py-6"><div className={`h-4 w-48 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-gray-100"}`}></div></td>
                    <td className="px-6 lg:px-8 py-6"><div className={`h-4 w-12 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-gray-100"}`}></div></td>
                    <td className="px-6 lg:px-8 py-6 text-right"><div className={`h-4 w-8 rounded animate-pulse ml-auto ${isDark ? "bg-slate-700" : "bg-gray-100"}`}></div></td>
                  </tr>
                ))
              ) : categories.map((cat) => (
                <tr key={cat.id} className={`transition-colors group ${isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-50/50"}`}>
                  <td className="px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-[#0e4b31]/5 text-[#0e4b31]"
                      }`}>
                        <LayoutGrid className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{cat.name}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>ID: #{cat.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-6">
                    <p className={`text-sm max-w-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>{cat.description || "No description provided."}</p>
                  </td>
                  <td className="px-6 lg:px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${isDark ? "bg-slate-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>24 items</span>
                  </td>
                  <td className="px-6 lg:px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(cat)}
                        className={`p-2 rounded-xl transition-all ${isDark ? "text-gray-400 hover:text-amber-400 hover:bg-slate-600" : "text-gray-400 hover:text-amber-600 hover:bg-amber-50"}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteMutation.mutate(cat.id)}
                        className={`p-2 rounded-xl transition-all ${isDark ? "text-gray-400 hover:text-rose-400 hover:bg-slate-600" : "text-gray-400 hover:text-rose-600 hover:bg-rose-50"}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className={`p-2 rounded-xl transition-all ${isDark ? "text-gray-500 hover:text-white" : "text-gray-300 hover:text-gray-900"}`}>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center sm:p-6">
          <div className={`w-full h-full sm:h-auto sm:max-w-md sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto ${
            isDark ? "bg-slate-800" : "bg-white"
          }`}>
            <div className={`mb-6 sm:mb-8 text-center ${isDark ? "text-white" : "text-gray-800"}`}>
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 ${
                isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-[#0e4b31]/10 text-[#0e4b31]"
              }`}>
                <Plus className="w-7 sm:w-8 h-7 sm:h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">{editingId ? "Edit Category" : "New Category"}</h2>
              <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Refine your catalog organization</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Electronics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 border-none rounded-xl sm:rounded-[1.5rem] focus:ring-2 focus:ring-[#0e4b31]/20 transition-all font-medium ${
                    isDark ? "bg-slate-700 text-white placeholder:text-gray-500" : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  }`}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Description</label>
                <textarea
                  placeholder="Short description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 border-none rounded-xl sm:rounded-[1.5rem] focus:ring-2 focus:ring-[#0e4b31]/20 transition-all font-medium h-24 sm:h-32 resize-none ${
                    isDark ? "bg-slate-700 text-white placeholder:text-gray-500" : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  }`}
                />
              </div>
              <div className="flex gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`flex-1 py-3 sm:py-4 text-sm font-bold transition-colors ${
                    isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 sm:py-4 bg-[#0e4b31] text-white rounded-xl sm:rounded-[1.2rem] text-sm font-bold shadow-lg shadow-green-900/10 hover:bg-[#0a3825] transition-all"
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

