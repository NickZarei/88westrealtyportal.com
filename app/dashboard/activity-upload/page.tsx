"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const activityOptions = [
  { label: "Google Review (with 88West)", value: "google_review" },
  { label: "Attended Office Event", value: "event_attendance" },
  { label: "Created Promo Video", value: "promo_video" },
  { label: "Recruited Realtor A (0–2 yrs)", value: "recruit_a" },
  { label: "Recruited Realtor B (2+ yrs)", value: "recruit_b" },
  { label: "Hosted Community Event", value: "community_event" },
];

export default function ActivityUploadPage() {
  const router = useRouter();
  const [activityType, setActivityType] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: activityType,
        details,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Activity submitted for approval!");
      router.push("/dashboard");
    } else {
      toast.error(data.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-6">
      <h1 className="text-xl font-bold mb-4 text-red-700">Submit Activity</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Activity Type</option>
          {activityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Add details (link, comments, etc.)"
          className="w-full p-2 border rounded"
          rows={4}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          {loading ? "Submitting..." : "Submit for Approval"}
        </button>
      </form>
    </div>
  );
}
