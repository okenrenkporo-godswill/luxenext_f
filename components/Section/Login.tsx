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
      console.error("Login error:", err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">Welcome Back 👋</h2>
        <p className="mb-6 text-center text-gray-500">Login to your account</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your email" />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} type={showPassword ? "text" : "password"} placeholder="Enter your password" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <button type="button" onClick={() => router.push("/register")} className="font-semibold text-green-600 hover:underline">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
