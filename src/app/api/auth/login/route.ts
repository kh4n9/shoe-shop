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
        { error: "Email hoặc mật khẩu không hợp lệ" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Email không tồn tại" },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không hợp lệ" },
        { status: 400 }
      );
    }

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

    const payload = {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secretKey);

    const response = NextResponse.json({
      success: true,
      message: "Đăng nhập thành công",
    });

    response.cookies.set("token", token);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
