"use client";
import React from "react"; // ✅ Required for JSX
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Activity {
  _id: string;
  type: string;
  notes?: string;
  createdBy: string;
  status: string;
}

export default function ApprovalsPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status;

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  if (status === "loading") return <p className="p-6">🔄 Checking permissions...</p>;

  if (!session || !["admin", "hr", "ceo"].includes(session.user?.role || "")) {
    return <p className="p-6 text-red-600">🚫 Access denied. Only Admin, HR, or CEO can view this page.</p>;
  }

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();

        if (Array.isArray(data)) {
          const pending = data.filter((a: Activity) => a.status === "Pending");
          setActivities(pending);
        } else {
          console.error("Invalid response:", data);
        }
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}/approve`, { method: "POST" });
      if (res.ok) {
        setActivities((prev) => prev.filter((a) => a._id !== id));
        alert("✅ Activity approved!");
      } else {
        alert("❌ Approval failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while approving.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" }),
      });
      const result = await res.json();
      if (result.success) {
        setActivities((prev) => prev.filter((a) => a._id !== id));
        alert("❌ Activity rejected.");
      } else {
        alert("Rejection failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while rejecting.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-red-700">📝 Pending Approvals</h1>
      {loading ? (
        <p>Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="text-gray-600 italic">No pending activities.</p>
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
                onClick={() => handleApprove(activity._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(activity._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
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
