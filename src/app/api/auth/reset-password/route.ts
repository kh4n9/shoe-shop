import User from "@/models/User";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const { password } = await req.json();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Đường dẫn không tồn tại hoặc đã hết hạn" },
        { status: 400 }
      );
    }
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const email = payload.email as string;
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email không tồn tại" },
        { status: 400 }
      );
    }
    user.password = await hash(password, 10);
    await user.save();
    return NextResponse.json(
      { success: true, message: "Mật khẩu đã được đặt lại" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Đã xảy ra lỗi" },
      { status: 500 }
    );
  }
}
