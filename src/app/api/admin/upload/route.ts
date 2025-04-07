import { NextRequest, NextResponse } from "next/server";
import { uploadImageToDiscord } from "@/utils/uploadImage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "Không có file nào được tải lên" },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = await file.arrayBuffer();
      return uploadImageToDiscord(Buffer.from(buffer), file.name);
    });

    const imageUrls = await Promise.all(uploadPromises);

    return NextResponse.json({ urls: imageUrls }, { status: 200 });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { message: "Lỗi khi tải file lên" },
      { status: 500 }
    );
  }
}
