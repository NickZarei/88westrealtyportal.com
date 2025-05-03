"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function UploadPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return toast.error("Please select an activity type");

    setSubmitting(true);

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

      const data = await res.json();

      if (data.success) {
        toast.success("✅ Activity submitted for approval!");
        setType("");
        setNotes("");
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch (err: any) {
      toast.error("❌ " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) {
    return <p className="p-6 text-center">Please log in to submit activities.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto p-6 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-md mt-10"
    >
      <h1 className="text-2xl font-bold text-red-700 mb-4 text-center">
        📥 Submit Your Activity
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
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
          className="w-full p-3 border border-gray-300 rounded"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Activity"}
        </button>
      </form>
    </motion.div>
  );
}
