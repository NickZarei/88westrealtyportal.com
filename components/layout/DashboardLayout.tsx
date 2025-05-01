"use client";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8 cursor-pointer" onClick={() => router.push("/dashboard")}>
          88West Portal
        </h2>

        <nav className="space-y-4">
          <button className="block w-full text-left" onClick={() => router.push("/dashboard")}>
            🏠 Dashboard
          </button>
          <button className="block w-full text-left" onClick={() => router.push("/dashboard/profile")}>
            👤 My Profile
          </button>
          <button className="block w-full text-left" onClick={() => router.push("/dashboard/settings")}>
            ⚙️ Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => router.push("/auth/login")}
          >
            Logout
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}
