"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

// ✅ Schema
const registerSchema = z
  .object({
    email: z.string().email({ message: "Enter a valid email address" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(30)
      .optional()
      .or(z.literal("")),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterCard() {
  const router = useRouter();
  const authStore = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", username: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: RegisterData) => {
    setLoading(true);

    try {
      const payload = {
        email: values.email,
        username: values.username || undefined,
        password: values.password,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || data.detail || "Registration failed");
        return;
      }

      // ✅ Auto-login if backend provides user + token
      if (data.user && data.token) {
        await authStore.login(data.user, data.token);
        toast.success("Registration successful! Logged in.");
        router.replace("/user/dashboard");
        return;
      }

      // Otherwise show success message and redirect to check-email page
      toast.success(data.message || "Registration successful! Check your email for verification link.");
      setTimeout(() => router.replace("/auth/check-email"), 1000);

    } catch (err: any) {
      console.error("Register error:", err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <h2 className="text-center text-2xl font-bold text-gray-800">Create an account</h2>
        <p className="mt-2 mb-6 text-center text-sm text-gray-500">
          Join BuyPoint — fast checkout, secure orders.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="you@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Choose a username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} type={showPassword ? "text" : "password"} placeholder="At least 6 characters" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5">
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input {...field} type={showPassword ? "text" : "password"} placeholder="Repeat your password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button type="button" onClick={() => router.replace("/login")} className="font-semibold text-green-600 hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
