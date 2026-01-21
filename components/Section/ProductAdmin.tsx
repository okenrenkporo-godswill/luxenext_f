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
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Catalog...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your store's items and inventory</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)} 
          className="bg-[#0e4b31] hover:bg-[#0a3825] text-white rounded-2xl flex items-center gap-2 px-6 shadow-lg shadow-green-100"
        >
          <Plus className="w-4 h-4" />
          Create Product
        </Button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters Bar */}
        <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#0e4b31]/10 transition-all font-medium"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-2xl border border-transparent">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={selectedCategory} 
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-none text-sm font-bold text-gray-600 focus:ring-0 p-0 pr-8"
              >
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="ghost" className="rounded-xl font-bold text-gray-500 hover:text-gray-900 gap-2">
              <Archive className="w-4 h-4" />
              Archives
            </Button>
            <button className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-colors ml-auto sm:ml-0">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Product</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Inventory</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedProducts?.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                        {product.thumbnail_url ? (
                          <img src={product.thumbnail_url} className="w-full h-full object-cover" alt={product.name} />
                        ) : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-6 h-6" /></div>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SKU: LUX-{product.id}-NX</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <span className="p-1 rounded-md bg-gray-100 text-gray-400"><ExternalLink className="w-3 h-3" /></span>
                       <span className="text-xs font-bold text-gray-600">{categories.find((c) => c.id === product.category_id)?.name || "Uncategorized"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${product.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1 w-24">
                       <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                          <span>Qty</span>
                          <span className={product.stock <= 5 ? "text-rose-600" : ""}>{product.stock}</span>
                       </div>
                       <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-500 ${product.stock <= 5 ? "bg-rose-500" : "bg-[#0e4b31]"}`} style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-gray-900">₦{product.price.toLocaleString()}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-8 bg-gray-50/30 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-gray-900">{Math.min(currentPage * itemsPerPage, filteredProducts?.length || 0)}</span> of <span className="text-gray-900">{filteredProducts?.length || 0}</span> items
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} 
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${page === currentPage ? "bg-[#0e4b31] text-white shadow-lg shadow-green-900/10" : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} 
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#0e4b31]/10 rounded-2xl flex items-center justify-center text-[#0e4b31]"><Package className="w-7 h-7" /></div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900">{editingProduct ? "Edit Product" : "Launch New Product"}</h2>
                    <p className="text-sm text-gray-500 font-medium">Capture details for your store catalog</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all font-black text-xl">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Vintage Leather Jacket" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0e4b31]/10 transition-all font-medium" required />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Write something compelling..." className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0e4b31]/10 transition-all font-medium h-48 resize-none" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Price (₦)</label>
                        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0e4b31]/10 transition-all font-bold" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Stock Count</label>
                        <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0e4b31]/10 transition-all font-bold" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0e4b31]/10 transition-all font-bold appearance-none cursor-pointer" required>
                        <option value="">Select Category</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Product Media</label>
                    <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-100 border-dashed rounded-3xl hover:border-[#0e4b31]/30 transition-colors group cursor-pointer relative">
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <div className="space-y-1 text-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-300 group-hover:text-[#0e4b31] transition-colors" />
                            <div className="flex text-sm text-gray-600">
                                <span className="relative font-bold text-[#0e4b31] hover:underline transition-all">Upload a file</span>
                                <p className="pl-1 text-xs">or drag and drop</p>
                            </div>
                            <p className="text-[10px] text-gray-400 uppercase font-black">PNG, JPG up to 10MB</p>
                            {form.file && <p className="text-xs font-bold text-emerald-600 mt-2">Selected: {form.file.name}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Discard</button>
                    <button type="submit" className="flex-1 py-4 bg-[#0e4b31] text-white rounded-2xl text-sm font-bold shadow-lg shadow-green-900/10 hover:bg-[#0a3825] transition-all">{editingProduct ? "Update Product" : "Save Changes"}</button>
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
