import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role?: "admin" | "agent" | "marketing" | "ceo" | "hr" | "conveyance";
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role?: "admin" | "agent" | "marketing" | "ceo" | "hr" | "conveyance";
  }

  interface JWT {
    sub: string;
    role?: "admin" | "agent" | "marketing" | "ceo" | "hr" | "conveyance";
  }
}
