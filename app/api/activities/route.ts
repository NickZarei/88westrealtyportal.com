import { NextResponse } from "next/server";
import Activity from "@/models/Activity";

export async function POST(req: Request): Promise<Response> {
  try {
    const body: { type: string; notes?: string; file?: string; createdBy?: string } = await req.json();

    const newActivity = await Activity.create({
      type: body.type,
      notes: body.notes || "",
      file: body.file || null,
      createdBy: body.createdBy || "guest",
      status: "Pending",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, activity: newActivity });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
    return NextResponse.json({ success: false, error: "Unknown error" });
  }
}
