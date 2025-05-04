import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";

export async function GET() {
  const db = await connectToDB();

  const results = await db.collection("activities").aggregate([
    { $match: { status: "Approved" } },
    {
      $group: {
        _id: "$createdBy",
        totalPoints: { $sum: "$points" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "email",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        email: "$_id",
        name: { $concat: ["$user.firstName", " ", "$user.lastName"] },
        role: "$user.role",
        totalPoints: 1,
      },
    },
    { $sort: { totalPoints: -1 } },
    { $limit: 50 },
  ]).toArray();

  return NextResponse.json({ success: true, leaderboard: results });
}
