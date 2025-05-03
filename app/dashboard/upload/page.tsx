"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!type) return setMessage("Please select an activity type.");

    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          notes,
          createdBy: session?.user?.email,
          status: "Pending",
        }),
      });

      if (res.ok) {
        setMessage("✅ Activity submitted for approval!");
        setType("");
        setNotes("");
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setMessage("❌ Submission failed.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("❌ Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) {
    return <p className="p-6 text-center">Please log in to submit activities.</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4 text-red-700">📥 Submit Your Activity</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Activity Type</option>
          <option value="Google Review">Google Review</option>
          <option value="Office Event Attendance">Office Event Attendance</option>
          <option value="88West Video Content">88West Video Content</option>
          <option value="Recruit Realtor A">Recruit Realtor A (0–2 yrs)</option>
          <option value="Recruit Realtor B">Recruit Realtor B (2+ yrs)</option>
          <option value="Community Event">Community Event</option>
        </select>

        <textarea
          placeholder="Optional notes or description"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Activity"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
