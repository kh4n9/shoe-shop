import { NextRequest, NextResponse } from "next/server";
import Brand from "@/models/Brand";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    const brands = await Brand.find();
    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy thương hiệu" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, description } = await req.json();
    const brand = await Brand.create({ name, description });
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi tạo thương hiệu" },
      { status: 500 }
    );
  }
}
