"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiRequestError } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  /* -------------------------- validation -------------------------- */
  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Enter a valid email address";
    }

    if (!password) {
      e.password = "Password is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* --------------------------- submit ---------------------------- */
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);
    try {
      await api.login({ email: email.trim(), password });

      // Cookie is now set by the server → go to dashboard
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setServerError(err.message);
        if (err.errors) setErrors(err.errors);
      } else {
        setServerError("Unexpected error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------- styles ---------------------------- */
  const field =
    "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {serverError && (
        <div className="rounded-lg border border-red-800 bg-red-950/60 px-3 py-2 text-sm text-red-300">
          {serverError}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((p) => ({ ...p, email: "" }));
          }}
          placeholder="user@example.com"
          className={field}
          autoComplete="email"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((p) => ({ ...p, password: "" }));
          }}
          placeholder="Your password"
          className={field}
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-sky-600 py-2.5 font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Login"}
      </button>
    </form>
  );
}