import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/[...nextauth]/options";
import { connectToDB } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await connectToDB();
  const activities = await db
    .collection("activities")
    .find({ createdBy: session.user.email, status: "Approved" })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ success: true, activities });
}
