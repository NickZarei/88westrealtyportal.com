import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Activity from "@/models/Activity";

export async function POST(req: Request): Promise<Response> {
  try {
    await connectToDB();

    const body = await req.json();

    const newActivity = await Activity.create({
      type: body.type,
      date: body.date ? new Date(body.date) : new Date(),  // ✅ Optional date fallback
      notes: body.notes || "",
      file: body.file || null,
      proof: body.proof || "",                              // ✅ Include proof if part of form
      createdBy: body.createdBy || "guest",
      status: "Pending",
    });

    return NextResponse.json({ success: true, activity: newActivity });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
