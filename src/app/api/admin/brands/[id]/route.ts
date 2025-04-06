import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import Product from "@/models/Product";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    const brand = await Brand.findById(params.id);
    return NextResponse.json(brand, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy thương hiệu" },
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
    const { name, description } = await req.json();
    await Brand.findByIdAndUpdate(params.id, { name, description });
    return NextResponse.json(
      { message: "Cập nhật thương hiệu thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi cập nhật thương hiệu" },
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
    const products = await Product.find({ brand: params.id });
    if (products.length > 0) {
      return NextResponse.json(
        { message: "Thương hiệu có sản phẩm không thể xóa" },
        { status: 400 }
      );
    }
    await Brand.findByIdAndDelete(params.id);
    return NextResponse.json(
      { message: "Đã xóa thương hiệu thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi xóa thương hiệu" },
      { status: 500 }
    );
  }
};
