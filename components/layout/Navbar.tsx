"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `text-sm font-medium hover:underline ${
      pathname === path || pathname.startsWith(path) ? "text-blue-600 underline" : "text-gray-700"
    }`;

  return (
    <nav className="w-full px-6 py-4 bg-white shadow sticky top-0 z-50 flex justify-between items-center">
      <div className="text-xl font-bold text-gray-900">88WestRealty</div>
      <div className="flex gap-6">
        <Link href="/" className={linkStyle("/")}>
          Home
        </Link>
        <Link href="/dashboard" className={linkStyle("/dashboard")}>
          Dashboard
        </Link>
        <Link href="/approvals" className={linkStyle("/approvals")}>
          Approvals
        </Link>
      </div>
    </nav>
  );
}
