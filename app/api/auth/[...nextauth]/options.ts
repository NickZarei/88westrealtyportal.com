import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

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

        const user = await User.findOne({ username: credentials?.username })
          .lean()
          .exec() as unknown as {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: "agent" | "admin" | "ceo" | "marketing" | "conveyance" | "hr";
          };

        if (!user || !user._id || !user.email || !user.role) return null;

        return {
          id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          role: user.role,
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
