// app/components/CurrentTime.tsx
"use client";   // <-- VERY IMPORTANT!

import { useEffect, useState } from "react";

export default function CurrentTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const now = new Date();
    setTime(now.toLocaleTimeString());
  }, []);

  return <p>The current time is {time}</p>;
}
