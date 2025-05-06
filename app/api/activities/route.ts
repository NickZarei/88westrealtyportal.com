import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Activity from "@/models/Activity";

// GET: Fetch all activities
export async function GET() {
  try {
    await connectToDB();

    const activities = await Activity.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, activities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Submit new activity
export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();

    const newActivity = await Activity.create({
      type: body.type,
      date: body.date,
      proof: body.proof || "",
      file: body.file || "",
      notes: body.notes || "",
      createdBy: body.createdBy,
    });

    return NextResponse.json({ success: true, activity: newActivity });
  } catch (error: any) {
    console.error("Activity POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
