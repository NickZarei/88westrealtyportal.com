import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// Extend the session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role?: "agent" | "admin" | "ceo" | "marketing" | "conveyance" | "hr";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ username: credentials?.username }).lean();

        if (!user || typeof user !== "object" || !("_id" in user)) return null;

        return {
          id: (user._id as string).toString(),
          name: `${(user as any).firstName || ""} ${(user as any).lastName || ""}`.trim(),
          email: (user as any).email,
          role: (user as any).role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as Session["user"]["role"];
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
