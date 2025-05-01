"use client";

import { useState } from "react";

export default function AddActivityModal({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [type, setType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    if (!type) return alert("Please select activity type");

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          notes,
          file: file?.name || null,
          createdBy: "nicknimaz@gmail.com",
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Activity submitted successfully!");
        onSubmit(result.activity);
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      alert("Submission failed");
    }

    setType("");
    setFile(null);
    setNotes("");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-lg font-bold mb-4">Add New Activity</h2>

      <label className="block mb-2 text-sm">Activity Type</label>
      <select
        className="w-full border px-3 py-2 rounded mb-4"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">Select one</option>
        <option value="5-Star Review">5-Star Review</option>
        <option value="Office Event">Office Event</option>
        <option value="Recruit A">Recruit A</option>
        <option value="Recruit B">Recruit B</option>
        <option value="Video">Video</option>
        <option value="Community Event">Community Event</option>
      </select>

      <label className="block mb-2 text-sm">Upload File (optional)</label>
      <input
        type="file"
        className="w-full mb-4"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <label className="block mb-2 text-sm">Notes (optional)</label>
      <textarea
        className="w-full border rounded px-3 py-2 mb-4"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
      >
        Submit Activity
      </button>
    </div>
  );
}