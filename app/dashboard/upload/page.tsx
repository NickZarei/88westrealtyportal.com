"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const sessionResult = useSession(); // ✅ SAFE
  const session = sessionResult?.data;
  const status = sessionResult?.status;

  const router = useRouter();
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const allowedRoles = ["agent", "marketing", "conveyance"];
      const userRole = (session?.user?.role || "").toLowerCase();

      if (!allowedRoles.includes(userRole)) {
        router.push("/dashboard");
      }
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please log in.</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Submit Activity</h1>
      {/* your form here */}
    </div>
  );
}
