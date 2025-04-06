import { NextRequest, NextResponse } from "next/server";
import Brand from "@/models/Brand";
import { connectDB } from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const brand = await Brand.findById(params.id);
    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      { error: "Error fetching brand" },
      { status: 500 }
    );
  }
}
