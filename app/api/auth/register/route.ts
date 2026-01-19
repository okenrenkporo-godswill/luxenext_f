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
      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        // Sanitize Pydantic error: only show the error message, hide the input data
        message = detail.map((d: any) => `${d.msg} (${d.loc[d.loc.length - 1]})`).join(", ");
      } else {
        message = detail || error.message;
      }
    } else {
      // Just a placeholder, we can log to a proper logging service in the future
    }

    return NextResponse.json({ error: message }, { status });
  }
}
