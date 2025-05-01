import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Activity from "@/models/Activity";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDb();

  const body = await req.json();
  const updated = await Activity.findByIdAndUpdate(
    params.id,
    { status: body.status },
    { new: true }
  );

  return NextResponse.json({ success: true, updated });
}
