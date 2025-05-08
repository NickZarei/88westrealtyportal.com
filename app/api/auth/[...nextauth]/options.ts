import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyPassword } from "@/lib/hash"; // optional

// 👇 Extend NextAuth session types
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

        // ✅ .exec() fixes the TypeScript error
        const user = await User.findOne({ username: credentials?.username }).lean().exec();
        if (!user) return null;

        // ✅ Optional: password check
        // const isValid = await verifyPassword(credentials!.password, user.password);
        // if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
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
