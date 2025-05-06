"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { File, CalendarDays, Trophy, CheckCircle, Settings, User } from "lucide-react";

const features = [
  { title: "Files", icon: <File className="w-8 h-8" />, link: "/files" },
  { title: "Events", icon: <CalendarDays className="w-8 h-8" />, link: "/events" },
  { title: "Leaderboard", icon: <Trophy className="w-8 h-8" />, link: "/leaderboard" },
  { title: "Approvals", icon: <CheckCircle className="w-8 h-8" />, link: "/approvals" },
  { title: "Settings", icon: <Settings className="w-8 h-8" />, link: "/settings" },
  { title: "Profile", icon: <User className="w-8 h-8" />, link: "/profile" },
];

export default function DashboardHome() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link href={feature.link} key={feature.title}>
            <Card className="hover:shadow-xl transition duration-300 cursor-pointer rounded-2xl p-4">
              <CardContent className="flex flex-col items-center justify-center h-40">
                <div className="mb-4 text-primary">{feature.icon}</div>
                <div className="text-xl font-semibold">{feature.title}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
