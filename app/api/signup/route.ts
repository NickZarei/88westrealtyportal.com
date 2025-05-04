import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
  const { firstName, lastName, email, username, phone, password, role, approvalCode } = await req.json();

  const db = await connectToDB();

  // ✅ 1. Prevent duplicate accounts
  const existingUser = await db.collection("users").findOne({ username });
  if (existingUser) {
    return NextResponse.json({ error: "Username already exists." }, { status: 409 });
  }

  // ✅ 2. Validate role approval codes
  const codeMap: Record<string, string> = {
    admin: process.env.ADMIN_APPROVAL_CODE!,
    ceo: process.env.MANAGER_APPROVAL_CODE!,
    marketing: process.env.MARKETING_APPROVAL_CODE!,
    operations: process.env.OPERATIONS_APPROVAL_CODE!,
  };

  if (role !== "agent") {
    const expectedCode = codeMap[role];
    if (!expectedCode || approvalCode !== expectedCode) {
      return NextResponse.json({ error: "Invalid approval code for this role." }, { status: 403 });
    }
  }

  // ✅ 3. Hash password
  const hashedPassword = await hashPassword(password);

  // ✅ 4. Insert new user
  await db.collection("users").insertOne({
    firstName,
    lastName,
    email,
    username,
    phone,
    password: hashedPassword,
    role,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
