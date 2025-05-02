import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const dirPath = path.join(process.cwd(), "public", "files");

  try {
    const files = fs.readdirSync(dirPath);
    return NextResponse.json(files);
  } catch (err) {
    console.error("File listing error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
