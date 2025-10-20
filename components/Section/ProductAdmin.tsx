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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (!showModal) {
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
        file: null,
      });
      setEditingProduct(null);
    }
  }, [showModal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, file: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock || !form.category_id) {
      return toast.error("Please fill all required fields");
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category_id", form.category_id);
    if (form.file) formData.append("file", form.file);

    try {
      if (editingProduct) {
        const updatedProduct = await updateProductMutation.mutateAsync({
          id: editingProduct.id,
          formData,
        });
        toast.success("Product updated successfully");
        queryClient.setQueryData(["adminProducts"], (old: any) =>
          old.map((p: any) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
      } else {
        const newProduct = await createProductMutation.mutateAsync(formData);
        toast.success("Product created successfully");
        queryClient.setQueryData(["adminProducts"], (old: any) => [...(old || []), newProduct]);
        setCurrentPage(1);
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
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
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success("Product deleted successfully");
      queryClient.setQueryData(["adminProducts"], (old: any) =>
        old.filter((p: any) => p.id !== id)
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  // ✅ LOADING STATE (Full Table Skeleton + Spinner)
  if (isLoading)
    return (
      <div className="p-6">
        <div className="flex justify-center mb-6">
          <RotatingLines strokeColor="#101112ff" strokeWidth="5" animationDuration="0.75" width="30" />
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="animate-pulse">
            <div className="bg-gray-100 h-10 w-full mb-2"></div>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-8 gap-3 border-b py-3 px-4 bg-gray-50"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                <div className="h-4 bg-gray-200 rounded col-span-2"></div>
                <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                <div className="h-4 bg-gray-200 rounded col-span-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  // ✅ Filtering + Pagination
  const filteredProducts = selectedCategory
    ? products?.filter((p) => p.category_id.toString() === selectedCategory)
    : products;
  const totalPages = filteredProducts ? Math.ceil(filteredProducts.length / itemsPerPage) : 1;
  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Product Panel</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingProduct ? "Edit Product" : "Create Product"}
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Start Day</th>
              <th className="border p-2">Product_id</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts?.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border p-2">
                  {product.thumbnail_url ? (
                    <img
                      src={product.thumbnail_url}
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.stock}</td>
                <td className="border p-2">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>
                <td className="border p-2">{product.id}</td>
                <td className="border p-2">₦{product.price}</td>
                <td className="border p-2">
                  {categories.find((c) => c.id === product.category_id)?.name || "No Category"}
                </td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-400"
          }`}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded ${
              page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-400"
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-400"
          }`}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Create Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="w-full border p-2 rounded"
                required
              />
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input type="file" onChange={handleFileChange} />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;
