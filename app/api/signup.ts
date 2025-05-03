import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User"; // or your model file

export async function POST(req: Request) {
  try {
    await dbConnect();
    const form = await req.json();

    const codes: Record<string, string | undefined> = {
      admin: process.env.ADMIN_APPROVAL_CODE,
      manager: process.env.MANAGER_APPROVAL_CODE,
      marketing: process.env.MARKETING_APPROVAL_CODE,
      operations: process.env.OPERATIONS_APPROVAL_CODE,
    };

    const expectedCode = codes[form.role?.toLowerCase()];
    if (!expectedCode || form.approvalCode !== expectedCode) {
      return NextResponse.json({ success: false, error: "Invalid approval code." }, { status: 403 });
    }

    const newUser = await User.create(form); // update fields as needed
    return NextResponse.json({ success: true, user: newUser });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
