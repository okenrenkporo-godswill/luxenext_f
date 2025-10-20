"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function VerifyPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const router = useRouter();
  const login = useAuthStore((state) => state.login); // ✅ from Zustand

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        // 1️⃣ Verify with FastAPI
        const res = await fetch(`http://127.0.0.1:8000/auth/verify?token=${token}`);
        const data = await res.json();

        if (!data.access_token || !data.user) {
          setStatus("error");
          setMessage("Verification failed. Please try again.");
          return;
        }

        // 2️⃣ Set secure HttpOnly cookie in Next.js
        const cookieRes = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: data.access_token }),
        });

        if (!cookieRes.ok) {
          setStatus("error");
          setMessage("Could not store session. Please try again.");
          return;
        }

        // 3️⃣ Log the user into Zustand
        await login(data.user, data.access_token);

        // 4️⃣ Success message and redirect
        setStatus("success");
        setMessage("✅ Email verified successfully! Redirecting...");
        setTimeout(() => router.replace("/user/dashboard"), 2000);
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Verification failed. Please try again later.");
      }
    };

    verifyEmail();
  }, [router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-center"
      >
        <div className="flex justify-center mb-6">
          {status === "loading" && <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />}
          {status === "success" && <CheckCircle className="w-12 h-12 text-green-500" />}
          {status === "error" && <XCircle className="w-12 h-12 text-red-500" />}
        </div>

        <motion.p
          key={message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-lg font-medium text-gray-800"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}
