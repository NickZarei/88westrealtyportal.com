// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "agent" | "marketing" | "ceo" | "hr" | "operations";
      points?: number;
    };
  }

  interface User {
    role?: "admin" | "agent" | "marketing" | "ceo" | "hr" | "operations";
    points?: number;
  }
}
