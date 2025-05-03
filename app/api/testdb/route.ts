import dbConnect  from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ success: true, message: "✅ DB connected" });
  } catch (error) {
    console.error("❌ DB Error:", error);
    return NextResponse.json(
      { success: false, message: "❌ DB connection failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}
