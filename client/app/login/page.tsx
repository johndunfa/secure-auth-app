import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 mb-6 text-sm text-slate-400">
          Sign in to continue to your dashboard.
        </p>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-sky-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}