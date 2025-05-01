"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState<any[]>([]);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (Array.isArray(data.events)) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
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
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setForm({ title: "", date: "", location: "" });
        fetchEvents(); // Refresh event list after creating new one
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Create New Event</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Create Event
        </button>
      </form>

      {success && <p style={{ color: "green", marginTop: "10px" }}>✅ Event created!</p>}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <h2 style={{ fontSize: "1.5rem", marginTop: "40px", marginBottom: "10px" }}>Upcoming Events</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {events.length > 0 ? (
          events.map((event) => (
            <li
              key={event._id}
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <strong>{event.title}</strong> <br />
              {new Date(event.date).toLocaleString()} <br />
              {event.location}
            </li>
          ))
        ) : (
          <li>No events found.</li>
        )}
      </ul>
    </div>
  );
}