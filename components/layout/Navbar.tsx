"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const linkStyle = (path: string) =>
    `text-sm font-medium hover:underline ${
      pathname === path || pathname.startsWith(path)
        ? "text-red-700 underline"
        : "text-gray-700"
    }`;

  return (
    <nav className="w-full px-6 py-4 bg-white shadow sticky top-0 z-50 flex justify-between items-center">
      {/* Left: Logo + Name */}
      <div className="flex items-center gap-2">
        <img
          src="/88west-logo.png"
          alt="88West Logo"
          className="h-8 w-auto"
        />
        <span className="text-xl font-bold text-red-700">88West Realty</span>
      </div>

      {/* Right: Nav Links */}
      <div className="flex gap-6 items-center">
        <Link href="/" className={linkStyle("/")}>
          Home
        </Link>
        <Link href="/dashboard" className={linkStyle("/dashboard")}>
          Dashboard
        </Link>
        <Link href="/dashboard/files" className={linkStyle("/dashboard/files")}>
          Files
        </Link>
        {(session?.user?.role === "marketing" || session?.user?.role === "admin") && (
          <Link href="/dashboard/upload" className={linkStyle("/dashboard/upload")}>
            Upload
          </Link>
        )}
        {session?.user?.role === "admin" && (
          <Link href="/approvals" className={linkStyle("/approvals")}>
            Approvals
          </Link>
        )}
        {!session ? (
          <button
            onClick={() => signIn("google")}
            className="text-sm text-blue-600 underline"
          >
            Login
          </button>
        ) : (
          <button
            onClick={() => signOut()}
            className="text-sm text-red-600 underline"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
