import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    const category = await Category.findById(params.id);
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy danh mục" },
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
    await Category.findByIdAndUpdate(params.id, { name, description });
    return NextResponse.json(
      { message: "Cập nhật danh mục thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi cập nhật danh mục" },
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
    const products = await Product.find({ category: params.id });
    if (products.length > 0) {
      return NextResponse.json(
        { message: "Danh mục có sản phẩm không thể xóa" },
        { status: 400 }
      );
    }
    await Category.findByIdAndDelete(params.id);
    return NextResponse.json(
      { message: "Đã xóa danh mục thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi xóa danh mục" },
      { status: 500 }
    );
  }
};
