import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "agent" | "marketing" | "ceo" | "hr" | "operations";
      points?: number;
    };
  }

  interface User {
    id: string;
    role?: "admin" | "agent" | "marketing" | "ceo" | "hr" | "operations";
    points?: number;
  }
}
