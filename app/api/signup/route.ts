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
      approvalCode = "",
    } = await req.json();

    if (!firstName || !lastName || !email || !username || !password || !role) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const db = await connectToDB();

    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists." }, { status: 409 });
    }

    const normalizedRole = (role || "").toLowerCase().trim();

    console.log("🔍 Role received:", role);
    console.log("🔍 Normalized role:", normalizedRole);
    console.log("🔍 Approval code received:", approvalCode);

    // ✅ Only check approval code if not agent
    if (normalizedRole !== "agent") {
      const codeMap: Record<string, string> = {
        admin: process.env.ADMIN_APPROVAL_CODE!,
        ceo: process.env.MANAGER_APPROVAL_CODE!,
        marketing: process.env.MARKETING_APPROVAL_CODE!,
        conveyance: process.env.CONVEYANCE_APPROVAL_CODE!,
        hr: process.env.HR_APPROVAL_CODE!,
      };

      const expectedCode = codeMap[normalizedRole];
      console.log("🔍 Expected code for role:", expectedCode);

      if (!expectedCode || approvalCode.trim() !== expectedCode) {
        console.log("❌ Approval code mismatch.");
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

    console.log("✅ New user created:", username);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❗ Signup error:", err.message);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
