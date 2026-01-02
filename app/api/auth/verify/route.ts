import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/axios";
import { isAxiosError } from "axios";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    // Call backend to verify
    const response = await apiClient.post("/auth/verify-email", { email, code });
    const data = response.data;

    const res = NextResponse.json({
      success: true,
      user: data.user,
      access_token: data.access_token
    });

    // Set session cookie
    if (data.access_token) {
      res.cookies.set("Token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return res;

  } catch (error: unknown) {
    let message = "Verification failed";
    let status = 500;

    if (isAxiosError(error)) {
      status = error.response?.status || 500;
      message = error.response?.data?.detail || error.message;
      console.error(`Verification failed [${status}]:`, message);
    } else {
      console.error("Unexpected error during verification:", error);
    }

    return NextResponse.json({ error: message }, { status });
  }
}
