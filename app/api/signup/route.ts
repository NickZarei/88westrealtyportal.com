import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { hashPassword } from "@/lib/hash";

export async function POST(req: NextRequest) {
  try {
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

    // ✅ Prevent duplicate usernames
    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists." }, { status: 409 });
    }

    // ✅ Normalize
    const normalizedRole = role.toLowerCase();
    const trimmedCode = approvalCode?.trim();

    // ✅ Validate codes for special roles
    const codeMap: Record<string, string> = {
      admin: process.env.ADMIN_APPROVAL_CODE!,
      ceo: process.env.MANAGER_APPROVAL_CODE!,
      marketing: process.env.MARKETING_APPROVAL_CODE!,
      operation: process.env.OPERATIONS_APPROVAL_CODE!,
      hr: process.env.HR_APPROVAL_CODE!,
    };

    if (normalizedRole !== "agent") {
      const expectedCode = codeMap[normalizedRole];
      if (!expectedCode || trimmedCode !== expectedCode) {
        return NextResponse.json({ error: "Invalid approval code for this role." }, { status: 403 });
      }
    }

    // ✅ Hash and insert user
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

    return NextResponse.json({ success: true, message: "User created" });
  } catch (err: any) {
    console.error("Signup Error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
