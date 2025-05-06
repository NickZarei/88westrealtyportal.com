"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const [activity, setActivity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>Please log in to submit an activity.</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          activity,
        }),
      });

      if (res.ok) {
        setMessage("✅ Activity submitted!");
        setActivity("");
      } else {
        setMessage("❌ Failed to submit activity.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error submitting activity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Submit Activity</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Enter your activity"
          className="border p-2 rounded w-full mb-4"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
