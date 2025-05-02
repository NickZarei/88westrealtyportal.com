"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function UploadPage() {
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("✅ File uploaded successfully!");
        setSelectedFile(null);
      } else {
        setMessage("❌ Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (session?.user?.role !== "marketing" && session?.user?.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto p-6 text-red-600 text-center">
        You do not have permission to upload files.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-red-700 mb-4">📤 Upload File</h1>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="w-full border rounded p-2"
        />

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}
