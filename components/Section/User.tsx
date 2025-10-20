"use client";

import { useState } from "react";
import { useUsers, useAdmins, useCreateAdmin, useDeleteUser, useDeleteAdmin, useUpdateUserRole } from "@/hook/queries";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Trash2, UserPlus, ShieldCheck } from "lucide-react";

export default function User() {
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: admins, isLoading: loadingAdmins } = useAdmins();

  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({ username: "", email: "", password: "" });

  const createAdminMutation = useCreateAdmin();
  const deleteUserMutation = useDeleteUser();
  const deleteAdminMutation = useDeleteAdmin();
  const updateRoleMutation = useUpdateUserRole();

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    createAdminMutation.mutate(adminForm, {
      onSuccess: () => {
        setAdminForm({ username: "", email: "", password: "" });
        setShowCreateAdmin(false);
      },
    });
  };

  const handleDeleteUser = (id: number, isAdmin = false) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    if (isAdmin) deleteAdminMutation.mutate(id);
    else deleteUserMutation.mutate(id);
  };

  const handleRoleChange = (id: number, role: string) => {
    updateRoleMutation.mutate({ user_id: id, new_role: role as "user" | "admin" | "superadmin" });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">👤 User & Admin Management</h1>

      {/* =================== ADMINS =================== */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Admin Accounts</h2>
          <Button onClick={() => setShowCreateAdmin(true)} className="flex gap-2 items-center">
            <UserPlus className="w-4 h-4" /> Add Admin
          </Button>
        </CardHeader>
        <CardContent>
          {loadingAdmins ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
            </div>
          ) : admins && admins.length > 0 ? (
            <table className="w-full text-left border-t">
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                <tr>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{admin.username}</td>
                    <td className="py-3 px-4">{admin.email}</td>
                    <td className="py-3 px-4">
                      <select
                        className="border rounded-md px-2 py-1 text-sm"
                        value={admin.role}
                        onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(admin.id, true)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-4">No admins found.</p>
          )}
        </CardContent>
      </Card>

      {/* =================== USERS =================== */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-700">All Users</h2>
        </CardHeader>
        <CardContent>
          {loadingUsers ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
            </div>
          ) : users && users.length > 0 ? (
            <table className="w-full text-left border-t">
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                <tr>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <select
                        className="border rounded-md px-2 py-1 text-sm"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      {user.is_verified ? (
                        <span className="text-green-600 font-medium">Verified</span>
                      ) : (
                        <span className="text-red-500 font-medium">Unverified</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-4">No users found.</p>
          )}
        </CardContent>
      </Card>

      {/* =================== CREATE ADMIN MODAL =================== */}
      {showCreateAdmin && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Username</label>
                <input
                  type="text"
                  value={adminForm.username}
                  onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Password</label>
                <input
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowCreateAdmin(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createAdminMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {createAdminMutation.isPending && <Loader2 className="animate-spin w-4 h-4" />}
                  <ShieldCheck className="w-4 h-4" /> Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
