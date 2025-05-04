"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // ✅ Add the console log RIGHT HERE
  console.log("Session:", session);

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <p className="p-6 text-center">Loading...</p>;
  if (!session?.user) return null;

  const name = session.user.name || "User";
  const role = session.user.role || "Unknown";
  const points = session.user.points || 0;

  const tiles = [
    { label: "📥 Upload Activity", href: "/dashboard/upload" },
    { label: "🏆 Leaderboard", href: "/dashboard/leaderboard" },
    { label: "📁 Files", href: "/dashboard/files" },
    { label: "✅ Approvals", href: "/dashboard/approvals" },
    { label: "👤 Profile", href: "/dashboard/profile" },
    { label: "⚙️ Settings", href: "/dashboard/settings" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6 mt-10"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-red-700">Welcome, {name}!</h1>
        <p className="text-gray-600">Role: {role} | Points: {points}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition text-center border border-gray-200 hover:bg-red-50"
          >
            <span className="text-xl font-medium text-red-600">{tile.label}</span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
