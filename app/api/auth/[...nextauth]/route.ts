import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

// Context typing provided by Next.js route handlers
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
  } catch (err) {
    console.error("PUT /api/events/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: (err as Error).message },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest, { params }: Context) {
  const { id } = params;

  try {
    await dbConnect();
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error", error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const { id } = params;

  try {
    await dbConnect();
    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Event deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error", error: (err as Error).message },
      { status: 500 }
    );
  }
}
