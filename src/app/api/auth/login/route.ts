import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { SignJWT } from "jose";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

// Login route
export const POST = async (req: NextRequest) => {
  try {
    connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

    const payload = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secretKey);

    if (user.role === "admin") {
      const res = NextResponse.redirect(new URL("/admin", req.nextUrl));

      res.cookies.set("token", token);

      return res;
    }
    const res = NextResponse.redirect(new URL("/", req.nextUrl));

    res.cookies.set("token", token);

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
