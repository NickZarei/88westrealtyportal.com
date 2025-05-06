"use client";

import { useSession } from "next-auth/react";

export default function UploadPage() {
  const sessionResult = useSession(); // ← do not destructure directly
  const session = sessionResult?.data;
  const status = sessionResult?.status;

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>Please log in to submit an activity.</p>;

  return (
    <div>
      <h1>Submit Activity</h1>
      {/* Your form goes here */}
    </div>
  );
}
