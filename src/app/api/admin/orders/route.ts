import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find();
    return NextResponse.json(orders);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy đơn hàng" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const {
      userId,
      products,
      status,
      totalPrice,
      name,
      phone,
      address,
      email,
      note,
      paymentMethod,
    } = await req.json();
    const order = await Order.create({
      userId,
      products,
      status,
      totalPrice,
      name,
      phone,
      address,
      email,
      note,
      paymentMethod,
    });
    return NextResponse.json(order);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi tạo đơn hàng" },
      { status: 500 }
    );
  }
}
