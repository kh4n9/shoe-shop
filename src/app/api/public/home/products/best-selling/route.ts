// api/public/home/products/best-selling

import { NextResponse } from "next/server";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

interface ProductInOrder {
  productId: string;
}

// Lấy danh sách sản phẩm bán chạy nhất dựa trên số lượng đơn hàng đã hoàn thành
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({ status: "completed" }).sort({
      createdAt: -1,
    });
    const productIds = [
      ...new Set(
        orders.flatMap((order) =>
          order.products.map((product: ProductInOrder) => product.productId)
        )
      ),
    ];
    const products = await Product.find({ _id: { $in: productIds } });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    return NextResponse.json(
      { error: "Failed to fetch best selling products" },
      { status: 500 }
    );
  }
}
