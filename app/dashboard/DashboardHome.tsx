"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Event {
  _id: string;
  title: string;
  date: string;
  description?: string;
  createdBy: string;
}

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data.data || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchEvents();
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEvents((prev) => prev.filter((event) => event._id !== id));
      } else {
        alert("Failed to delete event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (status === "loading" || loading) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  if (!session) {
    return <p className="p-6 text-center">Not authorized.</p>;
  }

  const user = session.user as any;
  const userRole = user?.role?.toLowerCase() || "";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user.firstName || user.name || user.email}
      </h1>

      {/* Dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Link href="/dashboard/profile">
          <div className="p-4 border rounded-lg shadow hover:bg-gray-50 transition cursor-pointer">
            <h2 className="text-lg font-semibold mb-1">👤 User Info</h2>
            <p className="text-sm text-gray-600">{user.role} — {user.email}</p>
          </div>
        </Link>

        <Link href="/dashboard/leaderboard">
          <div className="p-4 border rounded-lg shadow hover:bg-gray-50 transition cursor-pointer">
            <h2 className="text-lg font-semibold mb-1">🏆 Leaderboard</h2>
            <p className="text-sm text-gray-600">Current rankings and points</p>
          </div>
        </Link>

        <Link href="/dashboard/calendar">
          <div className="p-4 border rounded-lg shadow hover:bg-gray-50 transition cursor-pointer">
            <h2 className="text-lg font-semibold mb-1">📅 Calendar</h2>
            <p className="text-sm text-gray-600">View all upcoming events</p>
          </div>
        </Link>

        <Link href="/dashboard/marketing">
          <div className="p-4 border rounded-lg shadow hover:bg-gray-50 transition cursor-pointer">
            <h2 className="text-lg font-semibold mb-1">📣 Marketing</h2>
            <p className="text-sm text-gray-600">Access marketing materials</p>
          </div>
        </Link>

        <Link href="/dashboard/conveyance">
          <div className="p-4 border rounded-lg shadow hover:bg-gray-50 transition cursor-pointer">
            <h2 className="text-lg font-semibold mb-1">🧾 Conveyance</h2>
            <p className="text-sm text-gray-600">Download conveyance files</p>
          </div>
        </Link>

        {(userRole === "ceo" || userRole === "hr" || userRole === "admin") && (
          <Link href="/dashboard/approvals">
            <div className="p-4 border rounded-lg shadow hover:bg-gray-50 transition cursor-pointer">
              <h2 className="text-lg font-semibold mb-1">✅ Approvals</h2>
              <p className="text-sm text-gray-600">Review submitted agent activities</p>
            </div>
          </Link>
        )}
      </div>

      {/* Events List */}
      <h2 className="text-lg font-semibold mb-4">📅 Your Events</h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event._id}
              className="border p-4 rounded shadow-sm flex flex-col md:flex-row md:justify-between md:items-center"
            >
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleString()}
                </p>
                {event.description && (
                  <p className="mt-1 text-gray-700">{event.description}</p>
                )}
              </div>
              {(userRole === "admin" || user.email === event.createdBy) && (
                <button
                  onClick={() => handleDelete(event._id)}
                  className="mt-2 md:mt-0 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
