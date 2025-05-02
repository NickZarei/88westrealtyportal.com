import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "public", "files.json");

export async function POST(req: Request) {
  try {
    const { title, link } = await req.json();

    const current = fs.existsSync(FILE_PATH)
      ? JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"))
      : [];

    const updated = [...current, { title, link, uploadedAt: new Date() }];

    fs.writeFileSync(FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Upload failed:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = fs.existsSync(FILE_PATH)
      ? JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"))
      : [];

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Failed to load file list:", err);
    return NextResponse.json([], { status: 500 });
  }
}
