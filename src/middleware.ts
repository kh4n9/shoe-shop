import { NextResponse, NextRequest } from "next/server";

// Middleware
export const middleware = async (req: NextRequest) => {
  try {
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const response = await fetch("/api/auth/me", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.user.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
};
