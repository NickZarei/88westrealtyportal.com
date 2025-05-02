"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "88admin") {
      document.cookie = "admin=1; path=/"; // ✅ sets cookie
      router.push("/approvals");
    } else {
      alert("Incorrect admin password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="bg-white shadow-md p-6 rounded w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter admin code"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
