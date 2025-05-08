"use client";
import React from "react"; // ✅ Required for JSX
import dynamic from "next/dynamic";

// Dynamically load the client-side DashboardHome
const DashboardHome = dynamic(() => import("./DashboardHome"), { ssr: false });

export default function DashboardPage() {
  return <DashboardHome />;
}
