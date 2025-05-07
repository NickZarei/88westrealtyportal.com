"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
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
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Account created! Redirecting...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Create Your Account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="firstName" placeholder="First Name" required className="w-full p-2 border rounded" onChange={handleChange} />
        <input name="lastName" placeholder="Last Name" required className="w-full p-2 border rounded" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required className="w-full p-2 border rounded" onChange={handleChange} />
        <input name="username" placeholder="Username" required className="w-full p-2 border rounded" onChange={handleChange} />
        <input name="phone" placeholder="Phone" className="w-full p-2 border rounded" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required className="w-full p-2 border rounded" onChange={handleChange} />

        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="agent">AGENT</option>
          <option value="conveyancer">CONVEYANCER</option>
          <option value="marketing">MARKETING</option>
          <option value="hr">HR</option>
          <option value="admin">ADMIN</option>
          <option value="ceo">CEO</option>
        </select>

        {form.role !== "agent" && (
          <input name="approvalCode" placeholder="Approval Code" required className="w-full p-2 border rounded" onChange={handleChange} />
        )}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Create Account
        </button>
      </form>

      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
    </div>
  );
}
