import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  const isAdmin = token?.email === "ncinimaz@gmail.com"; // ← Replace with your real Gmail!

  if (request.nextUrl.pathname.startsWith("/approvals") && !isAdmin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/approvals"],
};
