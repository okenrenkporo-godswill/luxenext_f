"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useState } from "react";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";

/**
 * Schema: email, optional username, password, confirmPassword
 * ensure password === confirmPassword
 */
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterData) => {
    setLoading(true);
    setServerError(null);
    setSuccessMsg(null);

    // Only send fields your backend expects (no confirmPassword)
    const payload = {
      email: values.email,
      username: values.username || undefined,
      password: values.password,
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Typical flow: backend sends verification email.
        // Show success and redirect to a "check your email" page.
        setSuccessMsg(
          data.message || "Registration successful. Check your email for verification link."
        );

        // Replace history so user can't click back into the register page
        setTimeout(() => {
          router.replace("/auth/check-email"); // create this page to show instructions
        }, 1000);
      } else {
        // Show error sent from server (validation/duplicate email/etc)
        setServerError(data.error || data.detail || "Registration failed");
      }
    } catch (err: any) {
      setServerError(err?.message || "Unexpected error");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        {/* Header */}
        <h2 className="text-center text-2xl font-bold text-gray-800">Create an account</h2>
        <p className="mt-2 mb-6 text-center text-sm text-gray-500">
          Join BuyPoint — fast checkout, secure orders.
        </p>

        {/* Server messages */}
        {serverError && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700 border border-red-100">
            {serverError}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-700 border border-green-100">
            {successMsg}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-400"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Username (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Choose a username"
                      className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-400"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat your password"
                      className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-400"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-600 py-2 text-white font-semibold shadow-md hover:bg-green-700 disabled:opacity-70"
            >
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
          <button
            type="button"
            onClick={() => router.replace("/login")}
            className="font-semibold text-green-600 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
