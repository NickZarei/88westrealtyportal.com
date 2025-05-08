import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Activity from "@/models/Activity";

export async function GET(req: NextRequest) {
  const userEmail = req.nextUrl.searchParams.get("email");
  if (!userEmail) {
    return NextResponse.json({ error: "Missing user email" }, { status: 400 });
  }

  try {
    await dbConnect();
    const activities = await Activity.find({ createdBy: userEmail, status: "Approved" });

    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    console.error("GET /api/activities error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
