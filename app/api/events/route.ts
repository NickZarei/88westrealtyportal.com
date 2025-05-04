import { connectToDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.date || !body.location) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = await connectToDB();
    const result = await db.collection("events").insertOne({
      title: body.title,
      date: body.date,
      location: body.location,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await connectToDB();
    const events = await db.collection("events").find({}).sort({ date: 1 }).toArray();
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
