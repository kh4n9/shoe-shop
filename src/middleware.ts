import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Middleware
export const middleware = async (req: NextRequest) => {
  try {
    if (req.nextUrl.pathname === "/login") {
      const token = req.cookies.get("token");

      if (!token) {
        return NextResponse.next();
      }

      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

      const { payload } = await jwtVerify(token.value, secretKey, {
        algorithms: ["HS256"],
      });

      const user = (payload as { user: { role: string } }).user;

      if (user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      } else {
        return NextResponse.redirect(new URL("/", req.nextUrl));
      }
    }
  } catch (error) {
    console.error(error);
  }
};
