"use client";

import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const role = session?.user?.role?.toLowerCase() || "";
  const name = session?.user?.name || "";

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-red-600">88West Realty</div>

      {session && (
        <div className="flex items-center gap-4">
          {/* 👤 User Info */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{name}</span>
            <span
              className={`text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide ${
                role === "admin" || role === "ceo"
                  ? "bg-red-100 text-red-700"
                  : role === "marketing"
                  ? "bg-yellow-100 text-yellow-700"
                  : role === "operation"
                  ? "bg-blue-100 text-blue-700"
                  : role === "agent"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {role}
            </span>
          </div>

          {/* 🚪 Logout Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
