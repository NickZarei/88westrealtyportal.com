import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Activity from "@/models/Activity";

export async function GET() {
  try {
    await connectToDB();

    const activities = await Activity.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, activities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
