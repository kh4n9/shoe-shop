import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/Category";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy danh mục" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, description } = await req.json();
    const category = await Category.create({ name, description });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi tạo danh mục" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, name, description } = await req.json();
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi cập nhật danh mục" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    // tìm các sản phẩm thuộc danh mục đó
    const products = await Product.find({ category: id });
    if (products.length > 0) {
      return NextResponse.json(
        { message: "Không thể xóa danh mục vì có sản phẩm thuộc danh mục đó" },
        { status: 400 }
      );
    }
    await Category.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Xóa danh mục thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi xóa danh mục" },
      { status: 500 }
    );
  }
}
