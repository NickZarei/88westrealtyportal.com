import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Activity from "@/models/Activity";

export async function GET() {
  try {
    await connectToDB();

    const leaderboard = await Activity.aggregate([
      { $match: { status: "Approved" } }, // Only approved activities
      {
        $group: {
          _id: "$createdBy", // Group by user (email or id)
          totalPoints: { $sum: "$points" }, // Sum points field
          count: { $sum: 1 },               // Number of activities
        },
      },
      { $sort: { totalPoints: -1 } },       // Sort by highest points
    ]);

    return NextResponse.json({ success: true, leaderboard });
  } catch (error: any) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
