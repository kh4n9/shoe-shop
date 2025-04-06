import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    const cart = await Cart.findById(params.id);
    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy giỏ hàng" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    const { status } = await req.json();
    await Cart.findByIdAndUpdate(params.id, { status });
    return NextResponse.json(
      { message: "Cập nhật giỏ hàng thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi cập nhật giỏ hàng" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    await Cart.findByIdAndDelete(params.id);
    return NextResponse.json(
      { message: "Đã xóa giỏ hàng thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi xóa giỏ hàng" },
      { status: 500 }
    );
  }
};
