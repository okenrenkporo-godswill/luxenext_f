"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckEmailPage() {
  const handleResend = async () => {
    // Example resend logic
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "user@example.com" }), // TODO: replace with actual user email
    });
    const data = await res.json();
    alert(data.message || "Verification email resent!");
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
          We’ve sent a verification link to your email.  
          Click the link inside to activate your account.
        </p>

        {/* Extra info */}
        <p className="mt-4 text-sm text-gray-500">
          Didn’t get the email? Check your spam folder or request another one.
        </p>

        {/* Resend button */}
        <Button
          onClick={handleResend}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-black rounded-xl shadow-md"
        >
          Resend Verification Email
        </Button>
      </motion.div>
    </div>
  );
}
