"use client";

import { useCartStore } from "@/store/useCartStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ✅ Schema
const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(6, { message: "Minimum of 6 characters" }),
});

// ✅ Role to dashboard mapping
const DASHBOARD_ROUTES: Record<string, string> = {
  superadmin: "/admin/dashboard",
  admin: "/admin/dashboard",
  user: "/user/dashboard",
};

export function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });


  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const res = await fetch(`api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || data.detail || "Login failed");
        return;
      }

      // Save user + token
      const authStore = useAuthStore.getState();
      await authStore.login(data.user, data.token);

      

      // ✅ Redirect based on role
      const rolePath = DASHBOARD_ROUTES[data.user.role] || "/user/dashboard";
      router.replace(rolePath);

      toast.success("Login successful");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Welcome Back 👋
        </h2>
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
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5"
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
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="font-semibold text-green-600 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
