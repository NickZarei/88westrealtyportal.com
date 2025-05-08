"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Event {
  _id: string;
  title: string;
  date: string;
  description?: string;
}

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);

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
        console.error("Error loading events", err);
      }
    };

    if (status === "authenticated") fetchEvents();
  }, [status]);

  const eventsForSelectedDate = events.filter((event) => {
    const eventDate = new Date(event.date).toDateString();
    return eventDate === selectedDate.toDateString();
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-red-700 mb-6">📅 Event Calendar</h1>

      <Calendar
        onChange={(date) => setSelectedDate(date as Date)}
        value={selectedDate}
        className="rounded-lg shadow-md"
      />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">
          Events on {selectedDate.toDateString()}:
        </h2>

        {eventsForSelectedDate.length === 0 ? (
          <p className="text-gray-500">No events scheduled.</p>
        ) : (
          <ul className="space-y-3">
            {eventsForSelectedDate.map((event) => (
              <li key={event._id} className="border p-4 rounded shadow">
                <h3 className="font-semibold text-red-600">{event.title}</h3>
                {event.description && (
                  <p className="text-sm text-gray-700 mt-1">
                    {event.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
