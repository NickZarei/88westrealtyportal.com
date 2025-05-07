import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to 88West Team Portal</h1>
      <p className="mb-4 text-gray-600">Please sign up or log in to continue.</p>
      <div className="flex space-x-4">
        <Link href="/signup" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Sign Up
        </Link>
        <Link href="/login" className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
          Log In
        </Link>
      </div>
    </main>
  );
}
