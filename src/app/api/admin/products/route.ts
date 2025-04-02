import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy sản phẩm" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, description, price, images, category, brand, sizes, colors } =
      await req.json();
    const product = await Product.create({
      name,
      description,
      price,
      images,
      category,
      brand,
      sizes,
      colors,
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi tạo sản phẩm" },
      { status: 500 }
    );
  }
}

//  body sẽ có dạng
// {
//   name: "Tên sản phẩm",
//   description: "Mô tả sản phẩm",
//   price: 100000,
//   image: "Ảnh sản phẩm",
// }

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const {
      id,
      name,
      description,
      price,
      images,
      category,
      brand,
      sizes,
      colors,
    } = await req.json();
    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price, images, category, brand, sizes, colors },
      { new: true }
    );
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi cập nhật sản phẩm" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    await Product.findByIdAndDelete(id);
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
}
