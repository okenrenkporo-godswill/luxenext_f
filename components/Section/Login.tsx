"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// ✅ Login validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(6, { message: "Minimum 6 characters" }),
});

// Role → dashboard mapping
const DASHBOARD_ROUTES: Record<string, string> = {
  superadmin: "/admin/dashboard",
  admin: "/admin/dashboard",
  user: "/user/dashboard",
};

export function Login() {
  const router = useRouter();
  const authStore = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // React Hook Form
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (authStore.isLoggedIn()) {
      const rolePath = DASHBOARD_ROUTES[authStore.user?.role || "user"];
      router.replace(rolePath);
    }
  }, [authStore, router]);

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok || !data.token || !data.user) {
        toast.error(data.error || "Login failed");
        return;
      }

      // ✅ Save user + token in Zustand store
      await authStore.login(data.user, data.token);

      toast.success("Login successful");

      // ✅ Redirect based on role
      const rolePath = DASHBOARD_ROUTES[data.user.role] || "/user/dashboard";
      router.replace(rolePath);

    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-gray-100">
        
        {/* Left Side: Login Form */}
        <div className="flex w-full flex-col justify-center p-8 sm:p-12 lg:w-1/2">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-8">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-300 fill-current">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
              </svg>
              <h1 className="text-2xl font-serif italic text-gray-300">Luxenext</h1>
            </div>
            
            <div className="mb-8">
                <div className="w-16 h-16 bg-[#0e4b31] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">Welcome Back</h2>
                <p className="mt-2 text-gray-500 font-medium">Login to your account</p>
            </div>
            
            <div className="w-full h-px bg-gray-100 mb-10" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="email@luxenext.com" 
                        className="h-12 rounded-xl border-gray-200 focus:ring-[#0e4b31] focus:border-[#0e4b31]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-1">
                        <FormLabel className="text-sm font-semibold text-gray-700">Password</FormLabel>
                        <button 
                            type="button" 
                            onClick={() => router.push("/forgot-password")}
                            className="text-sm font-semibold text-green-800 hover:text-[#0e4b31] transition-colors"
                        >
                            Forgot?
                        </button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input 
                            {...field} 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Your secure password" 
                            className="h-12 rounded-xl border-gray-200 focus:ring-[#0e4b31] focus:border-[#0e4b31]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-[#0e4b31] hover:bg-[#0a3825] h-14 rounded-xl text-white font-bold text-lg shadow-xl shadow-green-100 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-10 text-center text-sm font-medium text-gray-600">
            Don’t have an account?{" "}
            <button 
                type="button" 
                onClick={() => router.push("/register")} 
                className="font-bold text-[#0e4b31] hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Right Side: Branding/Visual */}
        <div className="hidden lg:flex w-1/2 bg-[#0e4b31] relative overflow-hidden flex-col justify-center p-16">
            {/* Abstract Background pattern */}
            <div className="absolute inset-0 opacity-20">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [-12, -10, -12],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-[#1a6d49] via-transparent to-transparent transform -rotate-12" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-gradient-to-tl from-[#0a3825] via-transparent to-transparent rounded-full blur-3xl" 
                />
            </div>

            <div className="relative z-10">
                <motion.h2 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl font-bold text-white leading-tight mb-12"
                >
                    Experience <br /> 
                    <span className="italic font-serif font-normal text-[#4ade80]">the Essence</span> <br />
                    of Luxury, <br />
                    simplified
                </motion.h2>

                {/* Decorative UI Elements match image */}
                <div className="relative mt-20">
                    {/* Main Card UI Mockup */}
                    <motion.div 
                        animate={{ 
                            y: [0, -15, 0],
                            rotate: [0, 1, 0]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-[340px] h-[400px] bg-white rounded-[2rem] shadow-2xl p-8 flex flex-col justify-between ml-auto transform translate-x-4 hover:translate-x-2 transition-transform duration-500"
                    >
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400 fill-current">
                                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-3xl font-bold text-gray-900">12,347.23 ₦</h3>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Combined balance</p>
                        </div>

                        <div className="mt-auto pt-8 border-t border-gray-50 flex justify-between items-end">
                            <div>
                                <p className="text-sm font-bold text-gray-900 mb-1">Primary Card</p>
                                <p className="text-[10px] font-mono font-bold text-gray-400">3495 **** **** 6917</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">2,546.64 ₦</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between items-center">
                            <span className="text-gray-300 font-bold italic tracking-tighter text-xl">VISA</span>
                            <button className="px-4 py-2 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 hover:bg-gray-200 transition">View All</button>
                        </div>
                    </motion.div>

                    {/* Smaller Floating element */}
                    <motion.div 
                        animate={{ 
                            y: [0, 20, 0],
                            rotate: [0, -2, 0]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute top-20 left-[-60px] w-16 h-100 bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-2 flex flex-col items-center justify-between py-6"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                             <div className="w-4 h-4 rounded-[4px] border-2 border-white/60" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-1 flex-wrap w-8 justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                             <div className="w-4 h-4 rounded-full border-2 border-white/60" />
                        </div>
                    </motion.div>

                    {/* Small Bottom Icon */}
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[-20px] left-0 w-14 h-14 bg-white rounded-xl shadow-xl flex items-center justify-center"
                    >
                         <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#0e4b31] fill-current">
                            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                        </svg>
                    </motion.div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
