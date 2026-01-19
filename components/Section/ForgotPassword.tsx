"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const forgotSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

export function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof forgotSchema>) => {
    setLoading(true);
    try {
      await forgotPassword(values.email);
      toast.success("Check your email for a password reset link");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <button 
          onClick={() => router.back()} 
          className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </button>

        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">Forgot Password 🔒</h2>
        <p className="mb-8 text-center text-sm text-gray-500">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="email@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 h-11 text-white">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
