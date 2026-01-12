import { NextRequest, NextResponse } from "next/server";

import { isAxiosError } from "axios";
import apiClient from "@/lib/axios";

export async function POST(request: NextRequest) {
  const { email, username, password } = await request.json();

  try {
    const response = await apiClient.post(
      "/auth/register",
      { email, username, password },

    );

    const data = response.data;
    const { access_token, user } = data;

    const res = NextResponse.json({
      success: true,
      message: data.message || "Registration successful",
      user: user || null,
      token: access_token || null,
    });

    if (access_token) {
      res.cookies.set("Token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days for register
      });
    }

    return res;
  } catch (error: unknown) {
    let message = "Registration failed";
    let status = 500;

    if (isAxiosError(error)) {
      status = error.response?.status || 500;
      message = error.response?.data?.detail || error.message;
      console.error(`Register failed [${status}]:`, message);
    } else {
      console.error("Unexpected error during register:", error);
    }

    return NextResponse.json({ error: message }, { status });
  }
}
