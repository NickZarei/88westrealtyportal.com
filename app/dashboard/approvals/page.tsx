"use client";

import { useEffect, useState } from "react";

export default function ApprovalsPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();

        // Make sure the response is an array
        if (Array.isArray(data)) {
          const pending = data.filter((a: any) => a.status === "Pending");
          setActivities(pending);
        } else {
          console.error("Invalid response format:", data);
        }
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const result = await res.json();

      if (result.success) {
        setActivities((prev) => prev.filter((a) => a._id !== id));
        alert(`Activity ${status.toLowerCase()}ed!`);
      } else {
        alert("Update failed: " + result.error);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong while updating status.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Pending Approvals</h1>
      {loading ? (
        <p>Loading...</p>
      ) : activities.length === 0 ? (
        <p>No pending activities.</p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity._id}
            className="bg-white rounded shadow p-4 mb-4 flex justify-between items-center"
          >
            <div>
              <p><strong>Type:</strong> {activity.type}</p>
              <p><strong>Submitted by:</strong> {activity.createdBy}</p>
              <p><strong>Notes:</strong> {activity.notes || "None"}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(activity._id, "Approved")}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(activity._id, "Rejected")}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
