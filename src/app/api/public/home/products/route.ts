import { NextResponse, NextRequest } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // get all products by brandId
    const brandId = req.nextUrl.searchParams.get("brand");
    if (brandId) {
      const products = await Product.find({ brand: brandId });
      return NextResponse.json(products);
    }
    // get all products by categoryId
    const categoryId = req.nextUrl.searchParams.get("category");
    if (categoryId) {
      const products = await Product.find({ category: categoryId });
      return NextResponse.json(products);
    }
    // get all products
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}
