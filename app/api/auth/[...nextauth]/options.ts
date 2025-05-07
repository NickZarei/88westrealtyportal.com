import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyPassword } from "@/lib/hash"; // optional, if password check is needed

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

        const user = await User.findOne({ username: credentials?.username });
        if (!user) return null;

        // ✅ Optional: If password hash check is required
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
        session.user.id = token.sub!; // ✅ use non-null assertion
        session.user.role = (token as any).role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
