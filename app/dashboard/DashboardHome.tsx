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
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data.data || []);
      } catch (err) {
        console.error("Error fetching events", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") fetchEvents();
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e._id !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (status === "loading" || loading) {
    return <p className="p-6 text-center text-gray-500">Loading...</p>;
  }

  if (!session) {
    return <p className="p-6 text-center text-red-600">Not authorized.</p>;
  }

  const user = session.user as any;
  const role = user?.role?.toLowerCase() || "";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-red-700 mb-6">
        Welcome, {user.firstName || user.name || user.email}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <DashboardCard title="👤 User Info" href="/dashboard/profile" text={`${role} — ${user.email}`} />
        <DashboardCard title="🏆 Leaderboard" href="/dashboard/leaderboard" text="Points & rankings" />
        <DashboardCard title="📅 Calendar" href="/dashboard/calendar" text="All upcoming events" />
        <DashboardCard title="📣 Marketing" href="/dashboard/marketing" text="Marketing tools & templates" />
        <DashboardCard title="🧾 Conveyance" href="/dashboard/conveyance" text="Download forms" />
        {(role === "admin" || role === "hr" || role === "ceo") && (
          <DashboardCard title="✅ Approvals" href="/dashboard/approvals" text="Review agent activities" />
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">📅 Your Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id} className="border p-4 rounded shadow flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</p>
                {event.description && <p className="mt-1">{event.description}</p>}
              </div>
              {(role === "admin" || user.email === event.createdBy) && (
                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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

function DashboardCard({ title, href, text }: { title: string; href: string; text: string }) {
  return (
    <Link href={href}>
      <div className="p-4 border rounded-xl shadow hover:shadow-md hover:-translate-y-1 hover:bg-red-50 transition duration-300 cursor-pointer">
        <h2 className="text-lg font-semibold mb-1">{title}</h2>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </Link>
  );
}
