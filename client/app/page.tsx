import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 text-6xl">🔐</div>

      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Secure User Authentication
      </h1>

      <p className="mt-4 max-w-xl text-slate-400">
        Next.js + TypeScript + Tailwind CSS on the front end. Express.js +
        TypeScript, Mongoose, JWT and bcrypt on the back end. Data persisted
        in MongoDB Atlas.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/register"
          className="rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-500"
        >
          Create Account
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-slate-700 px-6 py-3 font-semibold transition hover:bg-slate-800"
        >
          Login
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-slate-700 px-6 py-3 font-semibold transition hover:bg-slate-800"
        >
          Dashboard (protected)
        </Link>
      </div>

      <div className="mt-16 grid w-full max-w-2xl grid-cols-1 gap-3 text-left text-sm sm:grid-cols-3">
        <Feature title="bcrypt" body="Passwords hashed with 12 salt rounds" />
        <Feature title="JWT" body="Signed tokens in HTTP-only cookies" />
        <Feature title="Zod" body="Server-side validation on every request" />
      </div>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <p className="font-semibold text-sky-400">{title}</p>
      <p className="mt-1 text-slate-400">{body}</p>
    </div>
  );
}