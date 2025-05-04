"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    role: "",
    approvalCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("✅ Account created! Please login.");
      router.push("/login");
    } else {
      toast.error(`❌ ${data.error || "Signup failed"}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-red-600 mb-6">Create Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="firstName" placeholder="First Name" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="username" placeholder="Username" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" required />

        <select name="role" onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Role</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
          <option value="ceo">CEO</option>
          <option value="marketing">Marketing</option>
          <option value="operation">Operation</option>
          <option value="hr">HR</option>
        </select>

        {form.role !== "agent" && (
          <input
            name="approvalCode"
            placeholder="Approval Code"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        )}

        <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
          Sign Up
        </button>
      </form>
    </div>
  );
}
