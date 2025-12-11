'use client';

import Link from 'next/link';

export default function AdminLanding() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-3xl space-y-6">
        <div className="space-y-2 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-slate-300 text-sm">Access administrative tools and dashboards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/signin?role=admin"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/30 transition"
          >
            <div className="text-sm uppercase tracking-[0.14em] text-slate-300">Authentication</div>
            <div className="text-xl font-semibold mt-1">Sign in as admin</div>
            <p className="text-sm text-slate-400 mt-2">Use admin credentials stored in the admin table.</p>
          </Link>

          <Link
            href="/admin/dashboard"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/30 transition"
          >
            <div className="text-sm uppercase tracking-[0.14em] text-slate-300">Dashboard</div>
            <div className="text-xl font-semibold mt-1">Admin dashboard</div>
            <p className="text-sm text-slate-400 mt-2">Overview of users, disasters, and system health.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
