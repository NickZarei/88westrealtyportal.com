import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import Event from "@/models/Event";

// DELETE: Remove an event by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();
    const eventId = params.id;

    const deleted = await Event.findByIdAndDelete(eventId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Event deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
