"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface ConveyanceFile {
  _id: string;
  title: string;
  fileUrl: string;
  uploadedBy: string;
  createdAt: string;
}

export default function ConveyanceFilesPage() {
  const { data: session } = useSession();
  const [files, setFiles] = useState<ConveyanceFile[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch("/api/conveyance/files");
      const data = await res.json();
      setFiles(data.files);
    };

    fetchFiles();
  }, []);

  if (!session) {
    return <p className="text-center mt-20">Please log in</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">Conveyance Documents</h2>
      {files.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {files.map((file) => (
            <li key={file._id} className="border p-4 rounded shadow-sm">
              <h3 className="text-lg font-bold">{file.title}</h3>
              <p className="text-sm text-gray-500">Uploaded by: {file.uploadedBy}</p>
              <a
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
