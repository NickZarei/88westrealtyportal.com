import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import DriveFile from "@/models/DriveFile";

// Fixing the types for the DELETE request
export async function DELETE(
  req: Request, 
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();  // Make sure your connection is successful
    const deleted = await DriveFile.findByIdAndDelete(params.id);  // Ensure proper object ID is used

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "✅ File deleted" });
  } catch (error) {
    // Log the error for debugging
    console.error("Error deleting file:", error);
    
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
