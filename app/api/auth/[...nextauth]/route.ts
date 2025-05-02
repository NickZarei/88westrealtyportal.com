import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions, User } from "next-auth";
import type { RequestInternal } from "next-auth";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        _req: Pick<RequestInternal, "method" | "body" | "query" | "headers">
      ): Promise<User | null> {
        const user: User = {
          id: "1",
          name: "Test User",
          email: credentials?.email,
          // Type-safe role (if extended types exist)
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.role = token.role;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
