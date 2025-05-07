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
      approvalCode = "", // ✅ default empty string
    } = await req.json();

    if (!firstName || !lastName || !email || !username || !password || !role) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const db = await connectToDB();

    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists." }, { status: 409 });
    }

    const normalizedRole = role.toLowerCase();

    // ✅ Role-based approval codes
    const codeMap: Record<string, string> = {
      admin: process.env.ADMIN_APPROVAL_CODE!,
      ceo: process.env.MANAGER_APPROVAL_CODE!,
      marketing: process.env.MARKETING_APPROVAL_CODE!,
      conveyance: process.env.CONVEYANCE_APPROVAL_CODE!,
      hr: process.env.HR_APPROVAL_CODE!,
    };

    // ✅ Approval code check ONLY for non-agents
    if (normalizedRole !== "agent") {
      const expectedCode = codeMap[normalizedRole];
      if (!expectedCode || approvalCode.trim() !== expectedCode) {
        return NextResponse.json({ error: "Invalid approval code." }, { status: 403 });
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

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Signup error:", err.message);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
