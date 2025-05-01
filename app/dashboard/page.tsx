"use client";

import { useEffect, useState } from "react";

interface Activity {
  _id: string;
  type: string;
  date: string;
  proof?: string;
  notes?: string;
  createdBy?: string;
  status: string;
}

export default function DashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) {
        setActivities(data.activities);
      } else {
        console.error("Error fetching events:", data.error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      {activities.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity._id} className="bg-white rounded p-4 shadow">
              <p><strong>Type:</strong> {activity.type}</p>
              <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
              <p><strong>Notes:</strong> {activity.notes || "—"}</p>
              <p><strong>Status:</strong> {activity.status}</p>
              <p><strong>Created by:</strong> {activity.createdBy}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
