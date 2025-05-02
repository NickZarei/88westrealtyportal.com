import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "marketing" | "hr" | "operations" | "agent";
    };
  }

  interface User {
    role?: "admin" | "marketing" | "hr" | "operations" | "agent";
  }
}
