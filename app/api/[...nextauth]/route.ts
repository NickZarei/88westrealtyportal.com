import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

// Define the correct context shape
interface Context {
  params: { id: string };
}

export async function PUT(req: NextRequest, context: Context) {
  const { id } = context.params;

  try {
    await dbConnect();
    const body = await req.json();

    const updatedEvent = await Event.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/events/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
