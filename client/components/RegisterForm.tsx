"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiRequestError } from "@/lib/api";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /* -------------------------- handlers -------------------------- */
  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!form.name.trim()) {
      e.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      e.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }

    if (!form.password) {
      e.password = "Password is required";
    } else if (form.password.length < 8) {
      e.password = "Password must be at least 8 characters";
    } else if (
      !/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password) ||
      !/[0-9]/.test(form.password)
    ) {
      e.password =
        "Password needs an uppercase letter, a lowercase letter and a number";
    }

    if (!form.confirmPassword) {
      e.confirmPassword = "Please confirm your password";
    } else if (form.confirmPassword !== form.password) {
      e.confirmPassword = "Passwords do not match";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError("");
    setSuccess("");

    if (!validate()) return;

    setLoading(true);
    try {
      await api.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setSuccess("✅ Account created! Redirecting to login…");
      setForm(initialState);

      setTimeout(() => {
        router.push("/login");
      }, 1200);
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

      {success && (
        <div className="rounded-lg border border-green-800 bg-green-950/60 px-3 py-2 text-sm text-green-300">
          {success}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={update("name")}
          placeholder="Yohanis Tesfaye"
          className={field}
          autoComplete="name"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={update("email")}
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
          value={form.password}
          onChange={update("password")}
          placeholder="At least 8 chars, 1 upper, 1 lower, 1 number"
          className={field}
          autoComplete="new-password"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">{errors.password}</p>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={update("confirmPassword")}
          placeholder="Repeat your password"
          className={field}
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-sky-600 py-2.5 font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}