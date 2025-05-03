"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface User {
  name: string;
  email: string;
  points: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => b.points - a.points);
        setUsers(sorted);
      }
    };
    fetchUsers();
  }, []);

  const getMedal = (i: number) => {
    return i === 0
      ? "🥇"
      : i === 1
      ? "🥈"
      : i === 2
      ? "🥉"
      : "";
  };

  const getRowColor = (i: number) => {
    return i === 0
      ? "bg-yellow-100"
      : i === 1
      ? "bg-gray-100"
      : i === 2
      ? "bg-amber-100"
      : "bg-white";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md"
    >
      <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">🏆 Agent Leaderboard</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Points</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td className="py-4 px-4" colSpan={4}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, i) => (
                <tr key={user.email} className={`${getRowColor(i)} hover:bg-red-50`}>
                  <td className="py-3 px-4 font-bold">{getMedal(i) || i + 1}</td>
                  <td className="py-3 px-4">{user.name || "—"}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 font-semibold text-red-600">{user.points}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
