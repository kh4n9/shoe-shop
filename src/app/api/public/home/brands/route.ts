import { NextResponse } from "next/server";
import Brand from "@/models/Brand";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    const brands = await Brand.find();
    return NextResponse.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Error fetching brands" },
      { status: 500 }
    );
  }
}
