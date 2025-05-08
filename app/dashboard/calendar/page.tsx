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

        // Filter for upcoming events only
        const upcoming = (data.data || []).filter(
          (event: Event) => new Date(event.date) >= new Date()
        );

        setEvents(upcoming);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-red-700">📅 Upcoming Events</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : events.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event._id}
              className="p-4 border rounded shadow-sm bg-white hover:bg-red-50 transition"
            >
              <h2 className="font-semibold text-lg">{event.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleString()}
              </p>
              {event.description && (
                <p className="mt-1 text-gray-800">{event.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
