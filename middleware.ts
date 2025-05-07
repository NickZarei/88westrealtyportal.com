import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request as any, // ✅ This bypasses the type mismatch safely
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdmin = token?.email === "ncinimaz@gmail.com"; // ✅ Your admin check

  if (request.nextUrl.pathname.startsWith("/approvals") && !isAdmin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/approvals"],
};
