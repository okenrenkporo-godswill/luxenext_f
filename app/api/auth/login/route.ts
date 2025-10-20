import { NextRequest, NextResponse } from "next/server";
import qs from "querystring";
import apiClient from "@/lib/axios";
import { isAxiosError } from "axios";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password)
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    const formData = qs.stringify({ username: email, password });
    const response = await apiClient.post("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, user } = response.data;

    if (!access_token || !user)
      return NextResponse.json({ error: "Invalid response from backend" }, { status: 500 });

    // Set HTTP-only cookie for SSR & Vercel
    const res = NextResponse.json({ success: true, message: "Login successful", user, token: access_token });
    res.cookies.set("Token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return res;
  } catch (error: unknown) {
    let message = "Login failed";
    let status = 500;

    if (isAxiosError(error)) {
      status = error.response?.status || 500;
      message = error.response?.data?.detail || error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
