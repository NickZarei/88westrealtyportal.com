import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Adjusted to use absolute path alias
import Event from '@/models/Event'; // Import the Event model

interface Context {
  params: {
    id: string;
  };
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const { id } = params;

  try {
    await dbConnect();

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Event deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/events/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
