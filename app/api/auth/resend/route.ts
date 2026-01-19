import { NextRequest, NextResponse } from "next/server";
import axios from "@/lib/axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // { email: string }

    // call backend FastAPI resend-verification
    const res = await axios.post(`/auth/resend-verification`, body);

    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.detail || err.message || "Something went wrong";

    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}
