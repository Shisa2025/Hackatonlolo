'use client';

import Link from 'next/link';

export default function UserLanding() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-3xl space-y-6">
        <div className="space-y-2 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">User</div>
          <h1 className="text-3xl font-bold tracking-tight">User Console</h1>
          <p className="text-slate-300 text-sm">Access your dashboard and disaster info.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/signin?role=user"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/30 transition"
          >
            <div className="text-sm uppercase tracking-[0.14em] text-slate-300">Authentication</div>
            <div className="text-xl font-semibold mt-1">Sign in as user</div>
            <p className="text-sm text-slate-400 mt-2">Use credentials stored in the user table.</p>
          </Link>

          <Link
            href="/user/dashboard"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/30 transition"
          >
            <div className="text-sm uppercase tracking-[0.14em] text-slate-300">Dashboard</div>
            <div className="text-xl font-semibold mt-1">User dashboard</div>
            <p className="text-sm text-slate-400 mt-2">View your status and disaster summaries.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
