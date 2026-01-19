"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { 
  User, 
  Package, 
  Heart, 
  Mail, 
  CreditCard, 
  MapPin, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Bell,
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useOrderHistory } from "@/hook/queries";

export default function AccountPage() {
  const { user, logout, isLoggedIn, _hasHydrated } = useAuthStore();
  const { data: orders, isLoading: ordersLoading } = useOrderHistory();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (_hasHydrated && !isLoggedIn()) {
      router.push("/login");
    }
  }, [_hasHydrated, isLoggedIn, router]);

  if (!_hasHydrated || !isLoggedIn()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
           <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-gray-500 font-medium tracking-wide">Authenticating...</p>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { id: "overview", label: "Account Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package, href: "/orders" },
    { id: "inbox", label: "Inbox", icon: Mail },
    { id: "wishlist", label: "Saved Items", icon: Heart, href: "/wishlist" },
    { id: "address", label: "Address Book", icon: MapPin },
    { id: "details", label: "Personal Details", icon: Settings },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "cards", label: "Payment Cards", icon: CreditCard },
  ];

  const recentOrders = orders?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <nav className="flex flex-col py-2">
                {sidebarLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                        if (link.href) router.push(link.href);
                        else setActiveTab(link.id);
                    }}
                    className={`flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === link.id 
                        ? "bg-green-50 text-green-700 border-r-4 border-green-600" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className={`w-5 h-5 ${activeTab === link.id ? "text-green-600" : "text-gray-400"}`} />
                      {link.label}
                    </div>
                    <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === link.id ? "block" : "hidden md:block"}`} />
                  </button>
                ))}
                
                <div className="h-px bg-gray-100 my-2 mx-4"></div>
                
                <button 
                  onClick={() => {
                      logout();
                      toast.success("Logged out successfully");
                      router.push("/");
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
            
            <div className="mt-4 p-5 bg-gradient-to-br from-green-900 to-green-800 rounded-2xl text-white shadow-lg overflow-hidden relative group">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
               <p className="text-[10px] opacity-70 mb-1 font-black uppercase tracking-widest">LuxeNext VIP</p>
               <h4 className="font-bold text-lg mb-2">Member Rewards</h4>
               <p className="text-xs opacity-80 mb-4 leading-relaxed">You have 250 points! Redeem them for exclusive shipping discounts.</p>
               <Button variant="outline" className="w-full border-white/20 hover:bg-white hover:text-green-900 text-white font-bold h-9 text-xs transition-all">
                  REDEEM NOW
               </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              
              {/* Overview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Account Overview</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage your profile, orders and security settings</p>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Security Status</p>
                    <p className="text-sm font-bold text-green-700">Protected</p>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Details Card */}
                <div className="group border border-gray-100 rounded-2xl p-6 bg-white hover:border-green-200 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600" onClick={() => setActiveTab('details')}>
                         <Settings className="w-4 h-4" />
                      </Button>
                   </div>
                   <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Personal Profile</h3>
                      <p className="text-lg font-bold text-gray-900">{user?.username}</p>
                      <p className="text-sm text-gray-500 font-medium">{user?.email}</p>
                   </div>
                </div>

                {/* Address Card */}
                <div className="group border border-gray-100 rounded-2xl p-6 bg-white hover:border-green-200 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600" onClick={() => setActiveTab('address')}>
                         <ExternalLink className="w-4 h-4" />
                      </Button>
                   </div>
                   <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Shipping Address</h3>
                      <p className="font-bold text-gray-900">John Doe (Primary)</p>
                      <p className="text-sm text-gray-500 line-clamp-2">123 Luxury Avenue, Victoria Island, Lagos</p>
                   </div>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div className="mt-10">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                    <Button variant="link" onClick={() => router.push("/orders")} className="text-green-600 font-bold p-0 h-auto hover:text-green-700">
                       SEE ALL ORDERS
                    </Button>
                 </div>

                 <div className="space-y-4">
                    {ordersLoading ? (
                       <div className="flex justify-center py-12">
                          <Clock className="w-8 h-8 text-gray-200 animate-spin" />
                       </div>
                    ) : recentOrders.length === 0 ? (
                       <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-100">
                          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">No order history found yet.</p>
                       </div>
                    ) : (
                       recentOrders.map((order: any) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                   <Package className="w-6 h-6" />
                                </div>
                                <div>
                                   <p className="font-bold text-sm text-gray-900">Order #{order.order_reference}</p>
                                   <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                   <p className="font-black text-sm text-gray-900">₦{order.total_amount.toLocaleString()}</p>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase">{order.payment_status}</p>
                                </div>
                                <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-full ${
                                   order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                   order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                   {order.status}
                                </span>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              </div>

              {/* Security / Change Password View */}
              {activeTab === "security" && (
                <div className="max-w-md mx-auto py-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Security Settings</h2>
                  <p className="text-sm text-gray-500 mb-8">Update your password to keep your account secure.</p>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">New Password</label>
                        <input 
                          type="password" 
                          id="newPassword"
                          placeholder="Min 6 characters" 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Confirm New Password</label>
                        <input 
                          type="password" 
                          id="confirmPassword"
                          placeholder="••••••••" 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 font-bold h-12 shadow-lg shadow-green-200"
                      onClick={async () => {
                        const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;
                        const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;
                        
                        if (newPassword.length < 6) {
                          toast.error("Password must be at least 6 characters");
                          return;
                        }
                        if (newPassword !== confirmPassword) {
                          toast.error("Passwords do not match");
                          return;
                        }

                        try {
                          const { updateUser } = await import("@/lib/api");
                          if (user?.id) {
                            await updateUser(user.id, { password: newPassword });
                            toast.success("Password updated successfully");
                            (document.getElementById("newPassword") as HTMLInputElement).value = "";
                            (document.getElementById("confirmPassword") as HTMLInputElement).value = "";
                          }
                        } catch (err) {
                          toast.error("Failed to update password");
                        }
                      }}
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              )}

              {/* Bottom Quick Actions */}
              <div className="mt-12 pt-8 border-t border-gray-50 hidden sm:flex items-center gap-4">
                 <Button variant="ghost" className="text-gray-400 hover:text-gray-900 font-bold text-xs tracking-widest uppercase">
                    Privacy Policy
                 </Button>
                 <Button variant="ghost" className="text-gray-400 hover:text-gray-900 font-bold text-xs tracking-widest uppercase">
                    Terms of Service
                 </Button>
              </div>

            </div>
          </main>
          
        </div>

      </div>
    </div>
  );
}
