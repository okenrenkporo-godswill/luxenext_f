import { NextRequest, NextResponse } from "next/server";
import qs from "querystring";
import apiClient from "@/lib/axios";
import { isAxiosError } from "axios";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ Send login request to FastAPI backend
    const formData = qs.stringify({ username: email, password });
    const response = await apiClient.post("auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // ✅ Extract token and user info directly from backend response
    const { access_token, user } = response.data;

    if (!access_token || !user) {
      return NextResponse.json(
        { error: "Invalid response from backend" },
        { status: 500 }
      );
    }

    // ✅ Build Next.js response
    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      token: access_token,
      user, // e.g. { id, username, email, role }
    });

    // ✅ Set cookie for authentication
    res.cookies.set("Token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return res;
  } catch (error: unknown) {
    let message = "Login failed";
    let status = 500;

    if (isAxiosError(error)) {
      status = error.response?.status || 500;
      message = error.response?.data?.detail || error.message;
      console.error(`Login failed [${status}]:`, message);
    } else if (error instanceof Error) {
      message = error.message;
      console.error("Unexpected error during login:", message);
    }

    return NextResponse.json({ error: message }, { status });
  }
}
