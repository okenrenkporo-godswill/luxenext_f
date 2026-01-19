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
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

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

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to resend");
      }

      toast.success("Verification code resent!");
      setTimeLeft(120); // Reset timer to 2 minutes
      setStatus("idle");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-[2.5rem] shadow-2xl text-center border border-gray-100">
      <div className="flex justify-center mb-8">
        <div className="h-20 w-20 bg-[#f0f9f4] rounded-3xl flex items-center justify-center shadow-inner">
          <Mail className="h-10 w-10 text-[#0e4b31]" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">Verify your email</h2>
      <p className="text-gray-500 mb-8 text-sm font-medium">
        We sent a verification code to <br/>
        <span className="font-bold text-gray-900 underline decoration-[#0e4b31]/30">{email}</span>.
      </p>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="space-y-3 text-left">
          <label htmlFor="code" className="text-[10px] font-black uppercase tracking-widest text-[#0e4b31] ml-1">
            Verification Code
          </label>
          <Input
            id="code"
            type="text"
            placeholder="······"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-16 text-center text-3xl font-black tracking-[0.5em] rounded-2xl border-gray-100 bg-gray-50 focus:ring-[#0e4b31] focus:border-[#0e4b31] transition-all"
            maxLength={6}
          />
        </div>

        <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-400 font-medium">
              Code expires in: <span className={`font-black ${timeLeft < 30 ? "text-red-500" : "text-gray-900"}`}>{formatTime(timeLeft)}</span>
            </div>
            
            {timeLeft === 0 && (
                <p className="text-xs text-red-500 font-bold animate-pulse">Your code has expired. Please resend.</p>
            )}
        </div>

        <div className="space-y-3">
            <Button 
                type="submit" 
                className="w-full bg-[#0e4b31] hover:bg-[#0a3825] h-14 rounded-2xl text-white font-bold text-lg shadow-xl shadow-green-100 transition-all active:scale-[0.98]" 
                disabled={loading || timeLeft === 0}
            >
            {loading ? (
                <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...
                </>
            ) : (
                "Verify Now"
            )}
            </Button>

            <Button 
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={resending || (timeLeft > 30 && timeLeft < 120)}
                className="w-full h-12 rounded-xl text-sm font-bold text-[#0e4b31] hover:bg-green-50"
            >
                {resending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resending...</>
                ) : (
                    "Resend Code"
                )}
            </Button>
        </div>
      </form>

      <div className="mt-8">
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-2xl border border-green-100"
          >
            <div className="flex items-center text-green-700 gap-2 mb-1">
                <CheckCircle className="h-5 w-5" />
                <span className="font-bold">Verification Successful</span>
            </div>
            <p className="text-[10px] text-green-600 font-medium uppercase tracking-widest">Redirecting to Dashboard...</p>
          </motion.div>
        )}
        
        {status === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center text-red-600 gap-2 p-4 bg-red-50 rounded-2xl border border-red-100"
            >
              <XCircle className="h-5 w-5" />
              <span className="font-bold text-sm">Invalid code. Please try again.</span>
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
