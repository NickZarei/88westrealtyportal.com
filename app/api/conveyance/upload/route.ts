import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import ConveyanceFile from "@/models/ConveyanceFile";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { title, fileUrl, uploadedBy } = data;

    if (!title || !fileUrl || !uploadedBy) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectToDB();
    const newFile = await ConveyanceFile.create({
      title,
      fileUrl,
      uploadedBy,
    });

    return NextResponse.json({ message: "File uploaded", file: newFile });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
