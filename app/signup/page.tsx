'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    role: '',
    approvalCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/login');
    } else {
      alert('Signup failed. Check your data or approval code.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} type="text" className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} type="text" className="w-full border rounded-lg px-4 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full border rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} type="tel" className="w-full border rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input name="username" value={form.username} onChange={handleChange} type="text" className="w-full border rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input name="password" value={form.password} onChange={handleChange} type="password" className="w-full border rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input name="role" value={form.role} onChange={handleChange} type="text" className="w-full border rounded-lg px-4 py-2" placeholder="e.g. Agent" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Approval Code</label>
            <input name="approvalCode" value={form.approvalCode} onChange={handleChange} type="text" className="w-full border rounded-lg px-4 py-2" />
          </div>

          <button type="submit" className="w-full bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 transition">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
