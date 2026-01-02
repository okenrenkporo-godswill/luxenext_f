"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is missing. Please register again.");
      return;
    }
    if (!code) {
      toast.error("Please enter the verification code.");
      return;
    }

    setLoading(true);
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // Login user
      if (data.user && data.access_token) {
        await login(data.user, data.access_token);
      }

      setStatus("success");
      toast.success("Email verified successfully!");
      setTimeout(() => router.replace("/user/dashboard"), 1500);

    } catch (err: any) {
      console.error(err);
      setStatus("error");
      toast.error(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-center border border-gray-100">
      <div className="flex justify-center mb-6">
        <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify your email</h2>
      <p className="text-gray-500 mb-8">
        We sent a verification code to <span className="font-medium text-gray-900">{email}</span>.
        Enter it below to verify your account.
      </p>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="space-y-2 text-left">
          <label htmlFor="code" className="text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <Input
            id="code"
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>

        <div className="text-sm text-gray-500">
          Time remaining: <span className={`font-medium ${timeLeft < 60 ? "text-red-500" : "text-gray-700"}`}>{formatTime(timeLeft)}</span>
        </div>

        <Button type="submit" className="w-full" disabled={loading || timeLeft === 0}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>

      <div className="mt-6">
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center text-green-600 gap-2"
          >
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Verified! Redirecting...</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-blue-600" />}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
