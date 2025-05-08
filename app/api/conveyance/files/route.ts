import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import ConveyanceFile from "@/models/ConveyanceFile";

export async function GET() {
  try {
    await connectToDB();
    const files = await ConveyanceFile.find().sort({ createdAt: -1 });
    return NextResponse.json({ files });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Failed to load files" }, { status: 500 });
  }
}
