import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Activity from "@/models/Activity";

export async function GET() {
  try {
    await connectDb();
    const all = await Activity.find().sort({ createdAt: -1 });
    return NextResponse.json(all);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
