"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    role: "agent",
    approvalCode: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Signup failed.");
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold">Agent / Staff Signup</h2>

        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md" />

        <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md">
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
          <option value="ceo">CEO</option>
          <option value="marketing">Marketing</option>
          <option value="conveyance">Conveyance</option>
          <option value="hr">HR</option>
        </select>

        {/* ✅ Only show approvalCode input if role is NOT agent */}
        {formData.role !== "agent" && (
          <input
            type="text"
            name="approvalCode"
            placeholder="Approval Code"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        )}

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Sign Up</button>
      </form>
    </main>
  );
}
