"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🔐 Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ⏳ Loading state
  if (status === "loading") {
    return <p className="p-6 text-center">Loading...</p>;
  }

  // ❌ Not logged in
  if (!session) {
    return <p className="p-6 text-center">Not authorized.</p>;
  }

  const user = session.user as any; // 👈 Safe fallback for extended fields

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user.firstName || user.name || user.email}
      </h1>

      {/* You can add more dashboard content below */}
      <p>This is your team dashboard.</p>
    </div>
  );
}
