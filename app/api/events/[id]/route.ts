import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Activity from "@/models/Activity";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const body = await req.json();
  const updated = await Activity.findByIdAndUpdate(
    params.id,
    { status: body.status },
    { new: true }
  );

  return NextResponse.json({ success: true, updated });
}
