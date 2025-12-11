'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin Dashboard</div>
            <h1 className="text-3xl font-bold tracking-tight">Control Panel</h1>
            <p className="text-slate-300 text-sm">Manage users and review disaster records.</p>
          </div>
          <Link
            href="/signin?role=admin"
            className="px-4 py-2 rounded-xl border border-white/20 text-sm hover:border-white/40"
          >
            Sign out / switch
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/disaster-type"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/30 transition space-y-2"
          >
            <div className="text-sm uppercase tracking-[0.14em] text-slate-300">Manage</div>
            <div className="text-xl font-semibold">Disaster type management</div>
            <p className="text-sm text-slate-400">Create and maintain disaster types.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
