"use client";

import { useEffect, useState } from "react";

interface FileLink {
  title: string;
  link: string;
  uploadedAt: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileLink[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch("/api/drivefiles");
        const list = await res.json();
        setFiles(list.reverse()); // Show latest first
      } catch (err) {
        console.error("Failed to fetch file links:", err);
      }
    };

    fetchLinks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📁 Downloadable Files</h1>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
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
    </div>
  );
}
