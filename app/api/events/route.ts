import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const eventId = params.id;  // Access the 'id' from the params
    const body = await req.json();  // Get the data from the request body

    // Perform the update operation with the `eventId` and `body`
    // Example: await Event.update(eventId, body);

    return NextResponse.json({ success: true, message: "Event updated successfully!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
  }
}
