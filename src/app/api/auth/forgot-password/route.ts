import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { SignJWT, jwtVerify } from "jose";

// tạo transporter để gửi email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// hàm POST để gửi email
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Tài khoản không tồn tại" },
      { status: 400 }
    );
  }
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Đặt lại mật khẩu",
    text: `Click ${process.env.NEXTAUTH_URL}/reset-password?token=${token} để đặt lại mật khẩu`,
  };

  await transporter.sendMail(mailOptions);

  return NextResponse.json(
    { success: true, message: "Email đã được gửi" },
    { status: 200 }
  );
}

// hàm GET để xử lý reset password
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Token không hợp lệ" },
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
  return NextResponse.json(
    { success: true, message: "Email đã được gửi" },
    { status: 200 }
  );
}
