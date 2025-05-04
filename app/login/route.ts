import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { verifyPassword } from "@/lib/hash";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const db = await connectToDB();

  const user = await db.collection("users").findOne({ username });

  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json({ error: "Invalid login" }, { status: 401 });
  }

  return NextResponse.json({ success: true, user });
}
