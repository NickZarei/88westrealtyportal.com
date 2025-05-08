"use client";

import { useEffect, useState } from "react";

interface Event {
  _id: string;
  title: string;
  date: string;
  description?: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        const futureEvents = data.data?.filter((event: Event) => new Date(event.date) > new Date());
        setEvents(futureEvents || []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading events...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-red-700 mb-4">📅 Upcoming Events</h1>
      {events.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</p>
              {event.description && <p className="mt-1">{event.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
