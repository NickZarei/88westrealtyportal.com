import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      role?: "admin" | "agent" | "marketing" | "ceo" | "hr" | "conveyance";
    };
  }

  interface User {
    role?: "admin" | "agent" | "marketing" | "ceo" | "hr" | "conveyance";
  }

  interface JWT {
    role?: "admin" | "agent" | "marketing" | "ceo" | "hr" | "conveyance";
  }
}
