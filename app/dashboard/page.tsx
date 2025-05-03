"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Activity {
  _id: string;
  type: string;
  notes?: string;
  createdBy?: string;
  status: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/events");
        const all = await res.json();
        const mine = all.filter((a: Activity) => a.createdBy === session?.user?.email);
        setActivities(mine);
      } catch (err) {
        console.error("Failed to load activities", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchActivities();
    }
  }, [session?.user?.email]);

  const points = activities.reduce(
    (total, act) => (act.status === "Approved" ? total + 10 : total),
    0
  );
  const approvedCount = activities.filter((a) => a.status === "Approved").length;
  const rejectedCount = activities.filter((a) => a.status === "Rejected").length;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-red-700 mb-2">
        👋 Welcome, {session?.user?.name}
      </h1>
      
      {/* ✅ TEST LINE: to confirm this version is live */}
      <p className="text-blue-500 font-bold">
        🔥 TEST: New DashboardPage version deployed!
      </p>

      <p className="text-gray-700 mb-1">Email: {session?.user?.email}</p>
      <p className="mb-1">
        🎯 Total Points: <strong>{points}</strong>
      </p>
      <p className="mb-6">
        ✅ Approved: {approvedCount} | ❌ Rejected: {rejectedCount}
      </p>

      <h2 className="text-xl font-semibold mb-4">Your Submitted Activities</h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : activities.length === 0 ? (
        <p className="text-gray-600 italic">No activities submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="border border-gray-200 p-4 rounded shadow-sm bg-white"
            >
              <p>
                <strong>Type:</strong> {activity.type}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    activity.status === "Approved"
                      ? "text-green-600"
                      : activity.status === "Rejected"
                      ? "text-red-600"
                      : "text-gray-700"
                  }
                >
                  {activity.status}
                </span>
              </p>
              <p>
                <strong>Notes:</strong> {activity.notes || "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
