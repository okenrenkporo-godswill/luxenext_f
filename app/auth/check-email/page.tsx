"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

import { useState } from "react";
import apiClient from "@/lib/axios";

export default function CheckEmailPage() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!user?.email) {
      alert("User email not found. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/api/auth/resend-verification", {
        email: user.email,
      });
      alert(res.data.message || "Verification email resent!");
    } catch (err: any) {
      console.error("Resend email error:", err);
      alert(err.response?.data?.message || "Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl text-center"
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Check your email
        </h1>

        {/* Message */}
        <p className="text-gray-600">
          We’ve sent a verification link to <b>{user?.email}</b>. Click the link inside to activate your account.
        </p>

        {/* Extra info */}
        <p className="mt-4 text-sm text-gray-500">
          Didn’t get the email? Check your spam folder or request another one.
        </p>

        {/* Resend button */}
        <Button
          onClick={handleResend}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-black rounded-xl shadow-md"
        >
          {loading ? "Resending..." : "Resend Verification Email"}
        </Button>
      </motion.div>
    </div>
  );
}
