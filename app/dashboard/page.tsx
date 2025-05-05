'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [form, setForm] = useState({ title: '', date: '', location: '' });
  const [events, setEvents] = useState<any[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(Array.isArray(data.events) ? data.events : data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('✅ Event created!');
        setForm({ title: '', date: '', location: '' });
        fetchEvents();
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (err: any) {
      toast.error('❌ ' + err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10"
    >
      <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">📅 Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded"
        />
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700"
        >
          Create Event
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-10 mb-4">🎯 Upcoming Events</h2>
      <ul className="space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <motion.li
              key={event._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200"
            >
              <p className="font-bold text-lg">{event.title}</p>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700">{event.location}</p>
            </motion.li>
          ))
        ) : (
          <li className="text-gray-500">No events found.</li>
        )}
      </ul>
    </motion.div>
  );
}
