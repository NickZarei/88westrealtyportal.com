import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        // Simple hardcoded login check
        if (email === "admin@admin.com" && password === "admin") {
          return {
            id: "1", // ✅ string required
            name: "Admin",
            email: "admin@admin.com",
          };
        }

        return null; // ❌ Reject login
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // optional, customize this route
  },
});

export { handler as GET, handler as POST };
