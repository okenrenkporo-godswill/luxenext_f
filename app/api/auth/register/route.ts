import { NextRequest, NextResponse } from "next/server";
import qs from "querystring";
import { isAxiosError } from "axios";
import apiClient from "@/lib/axios";

export async function POST(request: NextRequest) {
  const { email, username, password } = await request.json();

  try {
    const formData = qs.stringify({ email, username, password });

    const response = await apiClient.post("/auth/register", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const data = response.data;

    return NextResponse.json({
      success: true,
      message: data.message || "Registration successful, check your email",
    });
  } catch (error: unknown) {
    let message = "Registration failed";
    let status = 500;

    if (isAxiosError(error)) {
      status = error.response?.status || 500;
      message = error.response?.data?.detail || error.response?.data?.message || error.message;
      console.error(`Register failed [${status}]:`, error.response?.data);
    } else if (error instanceof Error) {
      message = error.message;
      console.error("Unexpected error during register:", error);
    }

    return NextResponse.json({ error: message }, { status });
  }
}
