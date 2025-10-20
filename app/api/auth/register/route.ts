import { NextRequest, NextResponse } from "next/server";
import axios from "@/lib/axios"
import { isAxiosError } from "axios";

export async function POST(request: NextRequest) {
  const { email, username, password } = await request.json();

  try {
    const response = await axios.post(
      "/auth/register",
      { email, username, password },
   
    );

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
      message = error.response?.data?.detail || error.message;
      console.error(`Register failed [${status}]:`, message);
    } else {
      console.error("Unexpected error during register:", error);
    }

    return NextResponse.json({ error: message }, { status });
  }
}
