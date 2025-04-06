import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    const user = await User.findById(params.id);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy người dùng" },
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
    const { name, email, password, role } = await req.json();
    await User.findByIdAndUpdate(params.id, {
      name,
      email,
      password,
      role,
    });
    return NextResponse.json(
      { message: "Cập nhật người dùng thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi cập nhật người dùng" },
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
    const user = await User.findById(params.id);
    if (user?.orders.length > 0 || user?.carts.length > 0) {
      return NextResponse.json(
        { message: "Người dùng có đơn hàng hoặc giỏ hàng" },
        { status: 400 }
      );
    }
    await User.findByIdAndDelete(params.id);
    return NextResponse.json(
      { message: "Xóa người dùng thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi xóa người dùng" },
      { status: 500 }
    );
  }
};
