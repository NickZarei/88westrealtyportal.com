"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  points: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();

      if (Array.isArray(data)) {
        const sorted = data
          .filter((u: User) => u.points > 0)
          .sort((a, b) => b.points - a.points);
        setUsers(sorted);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-red-200">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-700">
          🏆 Agent Points Leaderboard
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-600 italic">No users with points yet.</p>
        ) : (
          <table className="w-full table-auto text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-red-600 text-sm uppercase tracking-wider">
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th className="text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user._id}
                  className={`bg-${i === 0 ? "yellow" : i === 1 ? "gray" : i === 2 ? "amber" : "white"
                    }-100 hover:bg-red-50 transition rounded-lg`}
                >
                  <td className="py-2 px-2 font-bold text-center text-red-700">{i + 1}</td>
                  <td className="py-2 px-2 font-medium">{user.name}</td>
                  <td className="py-2 px-2 text-sm text-gray-600">{user.email}</td>
                  <td className="py-2 px-2 text-right font-semibold text-red-600">
                    {user.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
