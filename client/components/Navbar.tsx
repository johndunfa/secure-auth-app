"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await api.logout();
    } catch {
      /* ignore — we redirect regardless */
    }

    router.replace("/login");
    router.refresh();
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight hover:text-sky-400"
        >
          🔐 SecureAuth
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/dashboard"
            className="text-slate-300 hover:text-sky-400"
          >
            Dashboard
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-lg bg-red-600 px-3 py-1.5 font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? "Logging out…" : "Logout"}
          </button>
        </div>
      </div>
    </nav>
  );
}