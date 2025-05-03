"use client";

import React, { useEffect, useState } from "react";

interface FileLink {
  _id: string;
  title: string;
  link: string;
  uploadedAt: string;
}

interface EventItem {
  _id: string;
  title: string;
  date: string;
  location: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileLink[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editedEvent, setEditedEvent] = useState<Partial<EventItem>>({});
  const [newFile, setNewFile] = useState({ title: "", link: "" });
  const [newEvent, setNewEvent] = useState({ title: "", location: "", date: "" });

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("/api/drivefiles");
        const list: FileLink[] = await res.json();
        setFiles(list.reverse());
      } catch (err) {
        console.error("❌ Failed to fetch file links:", err);
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (data.success) {
          const now = new Date();
          const futureEvents = data.data.filter(
            (event: EventItem) => new Date(event.date) > now
          );
          setEvents(futureEvents);
        }
      } catch (err) {
        console.error("❌ Failed to fetch events:", err);
      }
    };

    fetchFiles();
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error("❌ Delete failed:", error);
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      const res = await fetch(`/api/drivefiles/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) setFiles(files.filter((file) => file._id !== id));
    } catch (err) {
      console.error("❌ Delete file failed:", err);
    }
  };

  const handleEditClick = (event: EventItem) => {
    setEditingEventId(event._id);
    setEditedEvent({ title: event.title, location: event.location, date: event.date });
  };

  const handleEditChange = (field: keyof EventItem, value: string) => {
    setEditedEvent((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedEvent),
      });
      const result = await res.json();
      if (result.success) {
        setEvents(events.map((event) => (event._id === id ? { ...event, ...editedEvent } as EventItem : event)));
        setEditingEventId(null);
        setEditedEvent({});
      }
    } catch (err) {
      console.error("❌ Update failed:", err);
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/drivefiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFile),
      });
      const result = await res.json();
      if (result.success) {
        setFiles([result.data, ...files]);
        setNewFile({ title: "", link: "" });
      }
    } catch (err) {
      console.error("❌ File upload failed:", err);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      const result = await res.json();
      if (result.success) {
        setEvents([result.data, ...events]);
        setNewEvent({ title: "", location: "", date: "" });
      }
    } catch (err) {
      console.error("❌ Event creation failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">📁 Upload New File</h1>
      <form onSubmit={handleFileSubmit} className="mb-6 space-y-2">
        <input className="border p-1 rounded w-full" value={newFile.title} onChange={(e) => setNewFile({ ...newFile, title: e.target.value })} placeholder="File Title" required />
        <input className="border p-1 rounded w-full" value={newFile.link} onChange={(e) => setNewFile({ ...newFile, link: e.target.value })} placeholder="File URL" required />
        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Upload File</button>
      </form>

      <h1 className="text-2xl font-bold mb-4">📁 Downloadable Files</h1>
      {files.length === 0 ? <p>No files uploaded yet.</p> : (
        <ul className="space-y-4 mb-10">
          {files.map((file) => (
            <li key={file._id} className="bg-white shadow rounded p-4">
              <p className="font-semibold">{file.title}</p>
              <a href={file.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open File</a>
              <p className="text-sm text-gray-500">Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</p>
              <button onClick={() => handleDeleteFile(file._id)} className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete File</button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-2xl font-bold mb-2">📅 Create New Event</h2>
      <form onSubmit={handleEventSubmit} className="mb-6 space-y-2">
        <input className="border p-1 rounded w-full" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Event Title" required />
        <input className="border p-1 rounded w-full" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} placeholder="Location" required />
        <input type="datetime-local" className="border p-1 rounded w-full" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} required />
        <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Create Event</button>
      </form>

      <h2 className="text-xl font-bold mb-4">📅 Upcoming Events</h2>
      {events.length === 0 ? <p>No upcoming events found.</p> : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id} className="bg-white shadow rounded p-4">
              {editingEventId === event._id ? (
                <div className="space-y-2">
                  <input className="border rounded p-1 w-full" value={editedEvent.title || ""} onChange={(e) => handleEditChange("title", e.target.value)} placeholder="Event Title" />
                  <input className="border rounded p-1 w-full" value={editedEvent.location || ""} onChange={(e) => handleEditChange("location", e.target.value)} placeholder="Location" />
                  <input type="datetime-local" className="border rounded p-1 w-full" value={editedEvent.date?.slice(0, 16) || ""} onChange={(e) => handleEditChange("date", e.target.value)} />
                  <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => handleEditSave(event._id)}>Save</button>
                </div>
              ) : (
                <>
                  <p className="font-semibold">{event.title}</p>
                  <p>📍 {event.location}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(event.date).toLocaleString()}</p>
                  <div className="mt-2 space-x-2">
                    <button onClick={() => handleDelete(event._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                    <button onClick={() => handleEditClick(event)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
