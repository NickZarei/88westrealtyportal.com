import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Event from "../../../models/Event";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const newEvent = await Event.create(body);
    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
