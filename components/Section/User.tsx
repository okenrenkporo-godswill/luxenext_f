"use client";

import { useState } from "react";
import { useUsers, useAdmins, useCreateAdmin, useDeleteUser, useDeleteAdmin, useUpdateUserRole } from "@/hook/queries";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Loader2, 
  Trash2, 
  UserPlus, 
  ShieldCheck, 
  Users as UsersIcon, 
  ShieldAlert,
  Mail,
  MoreVertical,
  Search,
  Filter
} from "lucide-react";

export default function UserPanel() {
  const { data: users = [], isLoading: loadingUsers } = useUsers();
  const { data: admins = [], isLoading: loadingAdmins } = useAdmins();

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
        toast.success("Security account created");
      },
    });
  };

  const handleDeleteUser = (id: number, isAdmin = false) => {
    if (!confirm("This action is irreversible. Proceed?")) return;
    if (isAdmin) deleteAdminMutation.mutate(id);
    else deleteUserMutation.mutate(id);
  };

  const handleRoleChange = (id: number, role: string) => {
    updateRoleMutation.mutate({ user_id: id, new_role: role as "user" | "admin" | "superadmin" });
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">Manage permissions and customer accounts</p>
        </div>
        <Button 
          onClick={() => setShowCreateAdmin(true)} 
          className="bg-[#0e4b31] hover:bg-[#0a3825] text-white rounded-2xl flex items-center gap-2 px-6 shadow-lg shadow-green-100"
        >
          <UserPlus className="w-4 h-4" />
          Add privileged User
        </Button>
      </div>

      {/* SEARCH / FILTERS */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Filter by name or email..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#0e4b31]/10 font-medium" />
         </div>
         <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="ghost" className="rounded-xl text-gray-500 font-bold gap-2 flex-1 sm:flex-none">
               <Filter className="w-4 h-4" />
               Status
            </Button>
            <Button variant="ghost" className="rounded-xl text-gray-500 font-bold gap-2 flex-1 sm:flex-none">
               Role
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* =================== ADMINS CARD =================== */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0e4b31]/10 flex items-center justify-center text-[#0e4b31]">
                   <ShieldAlert className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Admin Staff</h2>
             </div>
             <button className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors">
                <MoreVertical className="w-5 h-5" />
             </button>
          </div>
          <div className="overflow-x-auto flex-1">
            {loadingAdmins ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-[#0e4b31]" /></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 uppercase text-[10px] font-black text-gray-400 tracking-widest">
                    <th className="px-8 py-4">Identity</th>
                    <th className="px-8 py-4">Role / Control</th>
                    <th className="px-8 py-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors group px-8">
                      <td className="px-8 py-5">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{admin.username}</p>
                          <p className="text-[10px] text-gray-400 font-medium truncate">{admin.email}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <select
                          className="bg-gray-50 border-none rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#0e4b31] focus:ring-2 focus:ring-[#0e4b31]/10 cursor-pointer"
                          value={admin.role}
                          onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="superadmin">Superadmin</option>
                        </select>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => handleDeleteUser(admin.id, true)} className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* =================== USERS CARD =================== */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                   <UsersIcon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Registered Users</h2>
             </div>
             <button className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors">
                <MoreVertical className="w-5 h-5" />
             </button>
          </div>
          <div className="overflow-x-auto flex-1">
            {loadingUsers ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 uppercase text-[10px] font-black text-gray-400 tracking-widest">
                    <th className="px-8 py-4">Customer Info</th>
                    <th className="px-8 py-4 text-center">Status</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                               {user.username?.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                               <p className="text-sm font-bold text-gray-900 truncate">{user.username}</p>
                               <p className="text-[10px] text-gray-400 font-medium truncate">{user.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${user.is_verified ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                           {user.is_verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-medium">
                         <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* =================== CREATE ADMIN MODAL =================== */}
      {showCreateAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-10 text-center text-gray-800">
               <div className="w-20 h-20 bg-[#0e4b31]/10 rounded-[2rem] flex items-center justify-center text-[#0e4b31] mx-auto mb-6">
                  <UserPlus className="w-10 h-10" />
               </div>
               <h2 className="text-2xl font-black">Elevate Credentials</h2>
               <p className="text-sm text-gray-500 mt-2">Grant administrative access to a new staff member</p>
            </div>
            <form onSubmit={handleCreateAdmin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                <input
                  type="text"
                  value={adminForm.username}
                  onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-[#0e4b31]/10 transition-all font-bold"
                  placeholder="admin_root"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                   <input
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-[#0e4b31]/10 transition-all font-bold"
                    placeholder="staff@luxenext.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Security Key (Password)</label>
                <input
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-[#0e4b31]/10 transition-all font-black"
                  required
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowCreateAdmin(false)} className="flex-1 py-4 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Cancel</button>
                <button
                  type="submit"
                  disabled={createAdminMutation.isPending}
                  className="flex-1 py-4 bg-[#0e4b31] text-white rounded-[1.2rem] text-sm font-black shadow-lg shadow-green-900/20 hover:bg-[#0a3825] transition-all flex items-center justify-center gap-2"
                >
                  {createAdminMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  Deploy Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
