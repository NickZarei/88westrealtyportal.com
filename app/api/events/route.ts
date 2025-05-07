import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

interface Context {
  params: { id: string };
}

export async function PUT(req: NextRequest, { params }: Context) {
  const { id } = params;

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
