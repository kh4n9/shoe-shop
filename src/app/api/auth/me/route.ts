import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token");

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secretKey, {
      algorithms: ["HS256"],
    });

    const user = (
      payload as {
        user: { role: string; _id: string; name: string; email: string };
      }
    ).user;

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
