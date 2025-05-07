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

  // ✅ 2. Normalize inputs
  const normalizedRole = role.toLowerCase();
  const trimmedCode = approvalCode?.trim();

  // ✅ 3. Define role-based codes
  const codeMap: Record<string, string> = {
    admin: process.env.ADMIN_APPROVAL_CODE!,
    ceo: process.env.MANAGER_APPROVAL_CODE!,
    marketing: process.env.MARKETING_APPROVAL_CODE!,
    operation: process.env.OPERATIONS_APPROVAL_CODE!,
    hr: process.env.HR_APPROVAL_CODE!,
  };

  // ✅ 4. Only validate code for non-agent roles
  if (normalizedRole !== "agent") {
    const expectedCode = codeMap[normalizedRole];
    if (!expectedCode || trimmedCode !== expectedCode) {
      return NextResponse.json({ error: "Invalid approval code for this role." }, { status: 403 });
    }
  }

  // ✅ 5. Hash password and save user
  const hashedPassword = await hashPassword(password);

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
