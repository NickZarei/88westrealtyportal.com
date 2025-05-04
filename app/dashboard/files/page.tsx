"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

export default function FilesPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const createEvent = () => {
    if (!title || !date || !location) return;
    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      date,
      location,
    };
    setEvents((prev) => [...prev, newEvent]);
    setTitle("");
    setDate("");
    setLocation("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-4 py-10"
    >
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        📅 Create New Event
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Event Title"
          className="flex-1 p-2 border border-gray-300 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          className="flex-1 p-2 border border-gray-300 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="flex-1 p-2 border border-gray-300 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          onClick={createEvent}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Create Event
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        🎯 Upcoming Events
      </h2>

      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="border-l-4 border-red-500 pl-4">
            <p className="text-lg font-medium">{event.title}</p>
            <p className="text-sm text-gray-600 font-semibold">
              {new Date(event.date).toLocaleString()}
            </p>
            <p className="text-sm text-gray-700">{event.location}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
