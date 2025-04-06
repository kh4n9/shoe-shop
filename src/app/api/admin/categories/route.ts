import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/Category";
import { connectDB } from "@/lib/mongodb";

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
