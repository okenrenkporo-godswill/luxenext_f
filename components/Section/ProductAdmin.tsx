"use client";

import React, { useState, useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "sonner";
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCategoriesAdmin,
} from "@/hook/queries";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Package, 
  Archive,
  Image as ImageIcon,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeContext";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category_id: string;
  file?: File | null;
}

const ProductAdmin: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useAdminProducts();
  const { data: categories = [] } = useCategoriesAdmin();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const { isDark } = useTheme();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    file: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (!showModal) {
      setForm({ name: "", description: "", price: "", stock: "", category_id: "", file: null });
      setEditingProduct(null);
    }
  }, [showModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) setForm((prev) => ({ ...prev, file: files[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock || !form.category_id) return toast.error("Please fill all required fields");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category_id", form.category_id);
    if (form.file) formData.append("file", form.file);

    try {
      if (editingProduct) {
        const updatedProduct = await updateProductMutation.mutateAsync({ id: editingProduct.id, formData });
        toast.success("Product updated successfully");
        queryClient.setQueryData(["adminProducts"], (old: any) => old.map((p: any) => (p.id === updatedProduct.id ? updatedProduct : p)));
      } else {
        const newProduct = await createProductMutation.mutateAsync(formData);
        toast.success("Product created successfully");
        queryClient.setQueryData(["adminProducts"], (old: any) => [...(old || []), newProduct]);
        setCurrentPage(1);
      }
      setShowModal(false);
    } catch (err) { toast.error("Something went wrong"); }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id.toString(),
      file: null,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product permanently?")) return;
    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success("Product deleted successfully");
      queryClient.setQueryData(["adminProducts"], (old: any) => old.filter((p: any) => p.id !== id));
    } catch (err) { toast.error("Failed to delete product"); }
  };

  const filteredProducts = selectedCategory ? products?.filter((p) => p.category_id.toString() === selectedCategory) : products;
  const totalPages = filteredProducts ? Math.ceil(filteredProducts.length / itemsPerPage) : 1;
  const paginatedProducts = filteredProducts?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <RotatingLines strokeColor="#0e4b31" strokeWidth="5" animationDuration="0.75" width="40" />
      <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>Loading Catalog...</p>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Products</h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Manage your store&apos;s items and inventory</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)} 
          className="bg-[#0e4b31] hover:bg-[#0a3825] text-white rounded-2xl flex items-center gap-2 px-4 sm:px-6 shadow-lg shadow-green-100/20 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Create Product
        </Button>
      </div>

      {/* Main Container */}
      <div className={`rounded-2xl sm:rounded-[2rem] border shadow-sm overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"
      }`}>
        {/* Filters Bar */}
        <div className={`p-4 sm:p-6 lg:p-8 border-b flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 ${
          isDark ? "border-slate-700" : "border-gray-50"
        }`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
              <input 
                type="text" 
                placeholder="Search products..."
                className={`w-full pl-10 pr-4 py-2.5 border-none rounded-xl sm:rounded-2xl text-sm focus:ring-2 focus:ring-[#0e4b31]/20 transition-all font-medium ${
                  isDark ? "bg-slate-700 text-gray-100 placeholder:text-gray-500" : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                }`}
              />
            </div>
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl sm:rounded-2xl border border-transparent ${
              isDark ? "bg-slate-700" : "bg-gray-50"
            }`}>
              <Filter className={`w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
              <select 
                value={selectedCategory} 
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className={`bg-transparent border-none text-sm font-bold focus:ring-0 p-0 pr-8 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="ghost" className={`rounded-xl font-bold gap-2 hidden sm:flex ${
              isDark ? "text-gray-400 hover:text-white hover:bg-slate-700" : "text-gray-500 hover:text-gray-900"
            }`}>
              <Archive className="w-4 h-4" />
              Archives
            </Button>
            <button className={`p-2.5 rounded-xl transition-colors ml-auto sm:ml-0 ${
              isDark ? "text-gray-500 hover:text-gray-300 hover:bg-slate-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}>
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {paginatedProducts?.map((product) => (
            <div key={product.id} className={`p-4 border-b last:border-b-0 ${isDark ? "border-slate-700" : "border-gray-100"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-16 h-16 rounded-xl overflow-hidden border flex-shrink-0 ${isDark ? "bg-slate-700 border-slate-600" : "bg-gray-100 border-gray-100"}`}>
                  {product.thumbnail_url ? (
                    <img src={product.thumbnail_url} className="w-full h-full object-cover" alt={product.name} />
                  ) : <div className={`w-full h-full flex items-center justify-center ${isDark ? "text-gray-600" : "text-gray-300"}`}><ImageIcon className="w-6 h-6" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{product.name}</p>
                  <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>{categories.find((c) => c.id === product.category_id)?.name || "Uncategorized"}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-sm font-black ${isDark ? "text-white" : "text-gray-900"}`}>₦{product.price.toLocaleString()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${product.stock > 0 ? (isDark ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-50 text-emerald-600") : (isDark ? "bg-rose-900/50 text-rose-400" : "bg-rose-50 text-rose-600")}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dashed ${isDark ? 'border-slate-700' : 'border-gray-100'}">
                <button onClick={() => handleEdit(product)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${
                  isDark ? "text-gray-400 hover:text-emerald-400 hover:bg-slate-700" : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
                }`}>
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button onClick={() => handleDelete(product.id)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${
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
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className={isDark ? "bg-slate-700/50" : "bg-gray-50/50"}>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Product</th>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Category</th>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Status</th>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Inventory</th>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Price</th>
                <th className={`px-6 lg:px-8 py-4 lg:py-5 text-xs font-bold uppercase tracking-widest text-right ${isDark ? "text-gray-400" : "text-gray-500"}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-gray-50"}`}>
              {paginatedProducts?.map((product) => (
                <tr key={product.id} className={`transition-all group ${isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-50/50"}`}>
                  <td className="px-6 lg:px-8 py-4 lg:py-5">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl overflow-hidden border flex-shrink-0 group-hover:scale-105 transition-transform ${
                        isDark ? "bg-slate-700 border-slate-600" : "bg-gray-100 border-gray-100"
                      }`}>
                        {product.thumbnail_url ? (
                          <img src={product.thumbnail_url} className="w-full h-full object-cover" alt={product.name} />
                        ) : <div className={`w-full h-full flex items-center justify-center ${isDark ? "text-gray-600" : "text-gray-300"}`}><ImageIcon className="w-6 h-6" /></div>}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{product.name}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>SKU: LUX-{product.id}-NX</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-5">
                    <div className="flex items-center gap-2">
                       <span className={`p-1 rounded-md ${isDark ? "bg-slate-700 text-gray-500" : "bg-gray-100 text-gray-400"}`}><ExternalLink className="w-3 h-3" /></span>
                       <span className={`text-xs font-bold ${isDark ? "text-gray-300" : "text-gray-600"}`}>{categories.find((c) => c.id === product.category_id)?.name || "Uncategorized"}</span>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      product.stock > 0 
                        ? (isDark ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-50 text-emerald-600") 
                        : (isDark ? "bg-rose-900/50 text-rose-400" : "bg-rose-50 text-rose-600")
                    }`}>
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-5">
                    <div className="flex flex-col gap-1 w-24">
                       <div className={`flex justify-between items-center text-[10px] font-bold uppercase ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          <span>Qty</span>
                          <span className={product.stock <= 5 ? "text-rose-500" : ""}>{product.stock}</span>
                       </div>
                       <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? "bg-slate-700" : "bg-gray-100"}`}>
                          <div className={`h-full transition-all duration-500 ${product.stock <= 5 ? "bg-rose-500" : "bg-[#0e4b31]"}`} style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className={`px-6 lg:px-8 py-4 lg:py-5 text-sm font-black ${isDark ? "text-white" : "text-gray-900"}`}>₦{product.price.toLocaleString()}</td>
                  <td className="px-6 lg:px-8 py-4 lg:py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(product)} className={`p-2 rounded-xl transition-all ${
                        isDark ? "text-gray-400 hover:text-emerald-400 hover:bg-slate-600" : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(product.id)} className={`p-2 rounded-xl transition-all ${
                        isDark ? "text-gray-400 hover:text-rose-400 hover:bg-slate-600" : "text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                      }`}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className={`p-4 sm:p-6 lg:p-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${
          isDark ? "bg-slate-700/30 border-slate-700" : "bg-gray-50/30 border-gray-50"
        }`}>
          <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Showing <span className={isDark ? "text-gray-300" : "text-gray-900"}>{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className={isDark ? "text-gray-300" : "text-gray-900"}>{Math.min(currentPage * itemsPerPage, filteredProducts?.length || 0)}</span> of <span className={isDark ? "text-gray-300" : "text-gray-900"}>{filteredProducts?.length || 0}</span> items
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} 
              disabled={currentPage === 1}
              className={`p-2 disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-900"}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    page === currentPage 
                      ? "bg-[#0e4b31] text-white shadow-lg shadow-green-900/10" 
                      : (isDark ? "text-gray-400 hover:bg-slate-600 hover:text-white" : "text-gray-400 hover:bg-gray-100 hover:text-gray-900")
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} 
              disabled={currentPage === totalPages}
              className={`p-2 disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-900"}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center sm:p-6 overflow-y-auto">
          <div className={`w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:my-auto sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto ${
            isDark ? "bg-slate-800" : "bg-white"
          }`}>
            <div className="flex justify-between items-start mb-6 sm:mb-10">
              <div className="flex items-center gap-3 sm:gap-5">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                  isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-[#0e4b31]/10 text-[#0e4b31]"
                }`}><Package className="w-6 sm:w-7 h-6 sm:h-7" /></div>
                <div>
                    <h2 className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>{editingProduct ? "Edit Product" : "Launch New Product"}</h2>
                    <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Capture details for your store catalog</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-2 rounded-xl transition-all ${
                isDark ? "text-gray-400 hover:text-white hover:bg-slate-700" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              }`}><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Product Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Vintage Leather Jacket" className={`w-full px-4 sm:px-6 py-3 sm:py-4 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#0e4b31]/20 transition-all font-medium ${
                      isDark ? "bg-slate-700 text-white placeholder:text-gray-500" : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                    }`} required />
                </div>
                <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Full Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Write something compelling..." className={`w-full px-4 sm:px-6 py-3 sm:py-4 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#0e4b31]/20 transition-all font-medium h-32 sm:h-48 resize-none ${
                      isDark ? "bg-slate-700 text-white placeholder:text-gray-500" : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                    }`} />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Price (₦)</label>
                        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" className={`w-full px-4 sm:px-6 py-3 sm:py-4 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#0e4b31]/20 transition-all font-bold ${
                          isDark ? "bg-slate-700 text-white placeholder:text-gray-500" : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        }`} required />
                    </div>
                    <div className="space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Stock Count</label>
                        <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" className={`w-full px-4 sm:px-6 py-3 sm:py-4 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#0e4b31]/20 transition-all font-bold ${
                          isDark ? "bg-slate-700 text-white placeholder:text-gray-500" : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        }`} required />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Category</label>
                    <select name="category_id" value={form.category_id} onChange={handleChange} className={`w-full px-4 sm:px-6 py-3 sm:py-4 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#0e4b31]/20 transition-all font-bold appearance-none cursor-pointer ${
                      isDark ? "bg-slate-700 text-white" : "bg-gray-50 text-gray-900"
                    }`} required>
                        <option value="">Select Category</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Product Media</label>
                    <div className={`mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl sm:rounded-3xl transition-colors group cursor-pointer relative ${
                      isDark ? "border-slate-600 hover:border-emerald-500/50" : "border-gray-100 hover:border-[#0e4b31]/30"
                    }`}>
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <div className="space-y-1 text-center">
                            <ImageIcon className={`mx-auto h-10 sm:h-12 w-10 sm:w-12 transition-colors ${
                              isDark ? "text-gray-600 group-hover:text-emerald-400" : "text-gray-300 group-hover:text-[#0e4b31]"
                            }`} />
                            <div className={`flex text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                <span className={`relative font-bold hover:underline transition-all ${isDark ? "text-emerald-400" : "text-[#0e4b31]"}`}>Upload a file</span>
                                <p className="pl-1 text-xs">or drag and drop</p>
                            </div>
                            <p className={`text-[10px] uppercase font-black ${isDark ? "text-gray-500" : "text-gray-400"}`}>PNG, JPG up to 10MB</p>
                            {form.file && <p className="text-xs font-bold text-emerald-500 mt-2">Selected: {form.file.name}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 sm:gap-4 pt-4 sm:pt-6">
                    <button type="button" onClick={() => setShowModal(false)} className={`flex-1 py-3 sm:py-4 text-sm font-bold transition-colors ${
                      isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                    }`}>Discard</button>
                    <button type="submit" className="flex-1 py-3 sm:py-4 bg-[#0e4b31] text-white rounded-xl sm:rounded-2xl text-sm font-bold shadow-lg shadow-green-900/10 hover:bg-[#0a3825] transition-all">{editingProduct ? "Update Product" : "Save Changes"}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;

