import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find().sort({ date: 1 });
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch events" }, { status: 500 });
  }
}
