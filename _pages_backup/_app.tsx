"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // ✅ Import toast

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.success(`📩 Password reset link sent to ${email}!`);

    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push('/auth/login');
    }, 1500); // optional small delay so user sees toast
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded mt-10">
      <h2 className="text-xl mb-4 text-center">Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block mb-4 w-full p-2 border"
          required
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 w-full">
          Send Reset Link
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        <a href="/auth/login" className="text-blue-600 underline">
          Back to Login
        </a>
      </p>
    </div>
  );
}