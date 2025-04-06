import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy sản phẩm" },
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
    const { name, description, price, images, category, brand, sizes, colors } =
      await req.json();
    await Product.findByIdAndUpdate(params.id, {
      name,
      description,
      price,
      images,
      category,
      brand,
      sizes,
      colors,
    });
    return NextResponse.json(
      { message: "Cập nhật sản phẩm thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi cập nhật sản phẩm" },
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
    await Product.findByIdAndDelete(params.id);
    return NextResponse.json(
      { message: "Xóa sản phẩm thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi xóa sản phẩm" },
      { status: 500 }
    );
  }
};
