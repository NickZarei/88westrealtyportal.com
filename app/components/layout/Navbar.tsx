"use client";

import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-red-600">88West Realty</div>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </nav>
  );
}
