import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    mongodb_uri: process.env.MONGODB_URI || "Not loaded",
  });
}
