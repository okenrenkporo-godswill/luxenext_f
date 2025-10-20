import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // ✅ Properly expire the Token cookie
    response.cookies.set("Token", "", {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
