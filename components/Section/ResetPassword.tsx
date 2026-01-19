"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const resetSchema = z.object({
  password: z.string().min(6, { message: "Minimum 6 characters" }),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      router.push("/login");
    }
  }, [token, router]);

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: z.infer<typeof resetSchema>) => {
    if (!token) return;
    setLoading(true);
    try {
      await resetPassword(token, values.password);
      toast.success("Password reset successfully! You can now login.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <div className="mb-6 flex justify-center">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
                <ShieldCheck className="w-8 h-8" />
            </div>
        </div>

        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">Reset Your Password</h2>
        <p className="mb-8 text-center text-sm text-gray-500">
          Enter a new secure password for your account.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 h-11 text-white">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
