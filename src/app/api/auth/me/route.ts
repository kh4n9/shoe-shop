import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

// Define a type for the JWT payload
interface JWTPayload {
  user: {
    id: string;
    role: string;
    name: string;
    email: string;
  };
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token");
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const decoded = (await jwtVerify(token.value, secretKey, {
      algorithms: ["HS256"],
    })) as { payload: JWTPayload };
    if (!decoded.payload.user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    const user = await User.findById(decoded.payload.user.id);
    const userWithoutPassword = user?.toObject();
    delete userWithoutPassword?.password;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
