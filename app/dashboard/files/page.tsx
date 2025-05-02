"use client";

import { useEffect, useState } from "react";

interface FileLink {
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

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("/api/drivefiles");
        const list = await res.json();
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
          setEvents(data.data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch events:", err);
      }
    };

    fetchFiles();
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (result.success) {
        alert("✅ Event deleted!");
        setEvents(events.filter((e) => e._id !== id));
      } else {
        alert("❌ Failed to delete event.");
      }
    } catch (err) {
      console.error("❌ Error deleting event:", err);
      alert("❌ Unexpected error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📁 Downloadable Files</h1>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul className="space-y-4 mb-10">
          {files.map((file, index) => (
            <li key={index} className="bg-white shadow rounded p-4">
              <p className="font-semibold">{file.title}</p>
              <a
                href={file.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Open File
              </a>
              <p className="text-sm text-gray-500">
                Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-bold mb-4">📅 Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event._id}
              className="bg-white shadow rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{event.title}</p>
                <p>📍 {event.location}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(event.date).toLocaleString()}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleDelete(event._id)}
                  className="text-red-600 underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
