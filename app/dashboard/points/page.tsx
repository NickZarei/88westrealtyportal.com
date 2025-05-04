"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Activity = {
  type: string;
  notes: string;
  points: number;
  createdAt: string;
};

export default function PointsPage() {
  const { data: session, status } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/activities/user");
      const data = await res.json();
      if (data.success) setActivities(data.activities);
    };
    fetchData();
  }, []);

  if (status === "loading") return <p className="p-6 text-center">Loading...</p>;
  if (!session) return <p className="p-6 text-center">Please log in.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-red-600">📈 Points History</h1>
      {activities.length === 0 ? (
        <p>No approved activities yet.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity, i) => (
            <li key={i} className="border p-4 rounded shadow bg-white">
              <div className="font-semibold">{activity.type}</div>
              <div className="text-sm text-gray-500">{new Date(activity.createdAt).toLocaleString()}</div>
              <div className="text-sm">{activity.notes}</div>
              <div className="font-bold text-green-700">+{activity.points} pts</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
