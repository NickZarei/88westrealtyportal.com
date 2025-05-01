"use client";

import { useEffect, useState } from "react";

export default function CurrentTime() {
  const [time, setTime] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    };

    updateTime(); // Set initial time immediately

    const intervalId = setInterval(updateTime, 1000); // Update every second

    // Start fade-in animation after a small delay
    setTimeout(() => {
      setVisible(true);
    }, 100); // 100ms delay

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <div
      style={{
        maxWidth: "300px",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
        textAlign: "center",
        fontSize: "1.25rem",
        fontWeight: "600",
        color: "#333",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(20px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      Current Time: {time}
    </div>
  );
}
