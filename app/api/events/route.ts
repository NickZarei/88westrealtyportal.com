import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Activity from "@/models/Activity";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDb();
    const body = await req.json();
    const updated = await Activity.findByIdAndUpdate(
      params.id,
      { status: body.status },
      { new: true }
    );
    return NextResponse.json({ success: true, activity: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
