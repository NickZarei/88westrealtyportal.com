"use client";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      alert(`Welcome ${data.user.name}!`);
    } else {
      alert(data.message || "Login failed!");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded mt-10">
        <h2 className="text-xl mb-4">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="block mb-2 w-full p-2 border"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="block mb-2 w-full p-2 border"
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>

      <p className="text-sm mt-2 text-center">
        <a href="/auth/forgot-password" className="text-blue-600 underline">
          Forgot your password?
        </a>
      </p>
    </>
  );
}
