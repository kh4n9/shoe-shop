import { NextRequest, NextResponse } from "next/server";
import Brand from "@/models/Brand";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

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

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, name, description } = await req.json();
    const brand = await Brand.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    return NextResponse.json(brand, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi cập nhật thương hiệu" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    // tìm các sản phẩm thuộc thương hiệu đó
    const products = await Product.find({ brand: id });
    if (products.length > 0) {
      return NextResponse.json(
        {
          message:
            "Không thể xóa thương hiệu vì có sản phẩm thuộc thương hiệu đó",
        },
        { status: 400 }
      );
    }
    await Brand.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Xóa thương hiệu thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi xóa thương hiệu" },
      { status: 500 }
    );
  }
}
