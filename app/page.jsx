'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Disaster Simulation</div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
        <p className="text-slate-300">Choose an action to continue.</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/signin"
            className="px-5 py-3 rounded-xl bg-slate-100 text-slate-900 font-semibold shadow hover:bg-white"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-5 py-3 rounded-xl border border-slate-400 text-slate-100 font-semibold hover:border-white"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
