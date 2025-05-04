import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/db";
import { hashPassword } from "../../../lib/hash";

export async function POST(req: Request) {
  const {
    firstName,
    lastName,
    email,
    username,
    phone,
    password,
    role,
    approvalCode,
  } = await req.json();

  const db = await connectToDB();

  // ✅ 1. Prevent duplicate usernames
  const existingUser = await db.collection("users").findOne({ username });
  if (existingUser) {
    return NextResponse.json({ error: "Username already exists." }, { status: 409 });
  }

  // ✅ 2. Validate role approval code if role ≠ agent
  const normalizedRole = role.toLowerCase();

  const codeMap: Record<string, string> = {
    admin: process.env.ADMIN_APPROVAL_CODE!,
    ceo: process.env.MANAGER_APPROVAL_CODE!,
    marketing: process.env.MARKETING_APPROVAL_CODE!,
    operation: process.env.OPERATIONS_APPROVAL_CODE!,
    hr: process.env.HR_APPROVAL_CODE!,
  };

  if (normalizedRole !== "agent") {
    const expectedCode = codeMap[normalizedRole];
    if (!expectedCode || approvalCode !== expectedCode) {
      return NextResponse.json({ error: "Invalid approval code for this role." }, { status: 403 });
    }
  }

  // ✅ 3. Hash password
  const hashedPassword = await hashPassword(password);

  // ✅ 4. Save user
  await db.collection("users").insertOne({
    firstName,
    lastName,
    email,
    username,
    phone,
    password: hashedPassword,
    role: normalizedRole,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
