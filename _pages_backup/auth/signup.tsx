"use client";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent',
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(data.message || "Signed up!");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded mt-10">
      <h2 className="text-xl mb-4">Sign Up</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="block mb-2 w-full p-2 border"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="block mb-2 w-full p-2 border"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="block mb-2 w-full p-2 border"
      />

      <select
        name="role"
        onChange={handleChange}
        className="block mb-4 w-full p-2 border"
      >
        <option value="agent">Agent</option>
        <option value="admin">Admin</option>
        <option value="ceo">CEO</option>
        <option value="marketing">Marketing</option>
        <option value="operations">Operations</option>
      </select>

      <button type="submit" className="bg-red-600 text-white px-4 py-2">
        Register
      </button>
    </form>
  );
}