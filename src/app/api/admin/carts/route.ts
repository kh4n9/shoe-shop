import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";

export async function GET() {
  try {
    await connectDB();
    const carts = await Cart.find();
    return NextResponse.json(carts);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy giỏ hàng" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, productId, quantity } = await req.json();
    const cart = await Cart.create({ userId, productId, quantity });
    return NextResponse.json(cart);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi tạo giỏ hàng" },
      { status: 500 }
    );
  }
}
