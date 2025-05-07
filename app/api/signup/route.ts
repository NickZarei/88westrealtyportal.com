import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { hashPassword } from "@/lib/hash";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📨 Signup Body:", body);

    const {
      firstName,
      lastName,
      email,
      username,
      phone,
      password,
      role,
      approvalCode,
    } = body;

    if (!role) {
      return NextResponse.json({ error: "Missing role in request." }, { status: 400 });
    }

    const db = await connectToDB();

    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists." }, { status: 409 });
    }

    const normalizedRole = role.toLowerCase();
    const trimmedCode = approvalCode?.trim();

    console.log("🔍 Normalized role:", normalizedRole);
    console.log("🔍 Approval code:", trimmedCode);

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

    console.log("✅ User created:", email);
    return NextResponse.json({ success: true, message: "User created" });

  } catch (err: any) {
    console.error("❌ Signup Error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
