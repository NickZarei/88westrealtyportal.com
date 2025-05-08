"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ConveyanceUploadPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({ title: "", fileUrl: "" });

  if (!session || session.user.role !== "operations") {
    return <p className="text-center mt-20">Access denied</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/conveyance/upload", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        uploadedBy: session.user.email,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (res.ok) {
      toast.success("File uploaded");
      router.push("/conveyance");
    } else {
      toast.error(result.error || "Failed to upload");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Upload Conveyance File</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          type="text"
          placeholder="File Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="fileUrl"
          type="url"
          placeholder="File URL"
          value={form.fileUrl}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
