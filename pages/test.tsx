"use client";

import { useState } from "react";

export default function TestPage() {
  const [result, setResult] = useState("");

  const submitTest = async () => {
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "5-Star Google Review",
          date: "2025-05-06",
          notes: "Left review for 88West",
          file: "https://example.com/proof.png",
          proof: "Screenshot attached",
          createdBy: "testuser@example.com",
        }),
      });

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult("Error: " + error);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Test POST to /api/activities</h2>
      <button onClick={submitTest} style={{ padding: "0.5rem 1rem" }}>
        Submit Test
      </button>
      <pre style={{ marginTop: "1rem", background: "#f3f3f3", padding: "1rem" }}>
        {result}
      </pre>
    </div>
  );
}
