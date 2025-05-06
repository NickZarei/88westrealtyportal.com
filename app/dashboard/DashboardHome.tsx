"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

const DashboardHome = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const role = user?.role?.toLowerCase(); // might be undefined

  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      title: "User Info",
      description: `${user?.name || "Agent"}\n${user?.email || "No email"}\n${currentTime}`,
      icon: "👤",
      href: "#",
    },
    {
      title: "Leaderboard",
      description: "Current rankings and points",
      icon: "🏆",
      href: "/leaderboard",
    },
    {
      title: "Calendar",
      description: "View all upcoming events",
      icon: "📅",
      href: "/events",
    },
    {
      title: "Marketing",
      description: "Access marketing materials",
      icon: "📣",
      href: "/marketing",
    },
    {
      title: "Operations",
      description: "Download operations files",
      icon: "🛠",
      href: "/operations",
    },
    {
      title: "Approvals",
      description: "Manage activity approvals",
      icon: "✅",
      href: "/approvals",
      roleOnly: ["ceo", "hr"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">88West Team Portal</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((card) => {
          if (card.roleOnly && (!role || !card.roleOnly.includes(role))) return null;

          return (
            <Link href={card.href} key={card.title}>
              <div className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-lg transition">
                <div className="text-4xl mb-3 text-center">{card.icon}</div>
                <h2 className="text-xl font-semibold text-center">{card.title}</h2>
                <p className="text-gray-600 text-sm text-center whitespace-pre-line mt-2">
                  {card.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardHome;
