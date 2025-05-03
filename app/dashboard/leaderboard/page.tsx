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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-red-700">🏆 Points Leaderboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600 italic">No users with points yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">#</th>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-bold">{i + 1}</td>
                  <td className="py-2">{user.name}</td>
                  <td className="py-2 text-sm text-gray-600">{user.email}</td>
                  <td className="py-2 text-red-600 font-semibold">{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
