import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="mt-1 mb-6 text-sm text-slate-400">
          Register to access protected routes.
        </p>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-sky-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}