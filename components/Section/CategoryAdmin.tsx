"use client";

import { useState } from "react";
import { useCategoriesAdmin, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hook/queries";

export default function CategoryPanel() {
  const { data: categories = [] } = useCategoriesAdmin();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: { name, description } });
    } else {
      createMutation.mutate({ name, description });
    }
    setName("");
    setDescription("");
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Category Panel</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded">
          {editingId ? "Update" : "Create"}
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td className="p-2 border">{cat.id}</td>
              <td className="p-2 border">{cat.name}</td>
              <td className="p-2 border">{cat.description}</td>
              <td className="p-2 border flex gap-2">
                <button
                  className="bg-yellow-500 text-white p-1 rounded"
                  onClick={() => {
                    setEditingId(cat.id);
                    setName(cat.name);
                    setDescription(cat.description || "");
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white p-1 rounded"
                  onClick={() => deleteMutation.mutate(cat.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
