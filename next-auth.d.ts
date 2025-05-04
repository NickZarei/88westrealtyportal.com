// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: "admin" | "agent" | "marketing" | "ceo" | "hr" | "operations";
    points?: number;
  }

  interface Session {
    user: User;
  }
}
