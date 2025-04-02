import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Middleware
export const middleware = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify<{ user: { id: string; role: string } }>(
      token,
      secret
    );

    if (payload.user.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
};

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
