"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  api,
  ApiRequestError,
  type User,
  type ProtectedResponse,
} from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();

  /* ----------------------------- state ----------------------------- */
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [protectedData, setProtectedData] =
    useState<ProtectedResponse | null>(null);
  const [protectedLoading, setProtectedLoading] = useState(false);
  const [protectedError, setProtectedError] = useState("");

  /* ---------------- Load authenticated user on mount ---------------- */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await api.me();
        if (!cancelled) setUser(res.user);
      } catch (err) {
        if (err instanceof ApiRequestError && err.status === 401) {
          router.replace("/login");
          return;
        }
        if (!cancelled) {
          setError("Could not load your session. Please retry.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  /* ---------------- Load the second protected route ---------------- */
  const loadProtected = useCallback(async () => {
    setProtectedLoading(true);
    setProtectedError("");

    try {
      const data = await api.protected();
      setProtectedData(data);
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        router.replace("/login");
        return;
      }
      setProtectedError("Failed to load protected data.");
    } finally {
      setProtectedLoading(false);
    }
  }, [router]);

  /* --------------------------- render states ------------------------ */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-slate-400">Loading your session…</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error || "Not authenticated."}</p>
        <button
          onClick={() => router.replace("/login")}
          className="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white transition hover:bg-sky-500"
        >
          Go to Login
        </button>
      </div>
    );
  }

  /* ---------------------------- rendered ---------------------------- */
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-slate-400">
          You are viewing a protected page. Only authenticated users get here.
        </p>

        {/* Authenticated user card */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold">Authenticated User</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <dt className="text-slate-400">Name</dt>
              <dd className="font-medium">{user.name}</dd>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <dt className="text-slate-400">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <dt className="text-slate-400">User ID</dt>
              <dd className="break-all font-mono text-xs text-slate-300">
                {user.id}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-slate-400">Authentication</dt>
              <dd className="font-medium text-green-400">✅ Authenticated</dd>
            </div>
          </dl>
        </section>

        {/* Second protected endpoint */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold">Protected API Data</h2>
          <p className="mt-1 text-sm text-slate-400">
            Fetched from{" "}
            <code className="text-sky-400">GET /api/protected</code>
          </p>

          <button
            onClick={loadProtected}
            disabled={protectedLoading}
            className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {protectedLoading ? "Loading…" : "Load Protected Data"}
          </button>

          {protectedError && (
            <p className="mt-3 text-sm text-red-400">{protectedError}</p>
          )}

          {protectedData && (
            <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-green-300">
              {JSON.stringify(protectedData, null, 2)}
            </pre>
          )}
        </section>
      </main>
    </>
  );
}