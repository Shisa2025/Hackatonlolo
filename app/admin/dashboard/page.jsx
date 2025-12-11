'use client';

import Link from 'next/link';

const mockUsers = [
  { email: 'alpha@example.com', role: 'admin', created_at: '2025-01-01' },
  { email: 'bravo@example.com', role: 'user', created_at: '2025-02-14' },
];

const mockDisasters = [
  { title: 'Seismic event', severity: 'high', occurred_at: '2025-03-10 12:30' },
  { title: 'Flood drill', severity: 'low', occurred_at: '2025-04-02 09:00' },
];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.14em] text-slate-300">Users</div>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
            <div className="text-sm text-slate-400">Total accounts</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.14em] text-slate-300">Disasters</div>
            <div className="text-2xl font-bold">{mockDisasters.length}</div>
            <div className="text-sm text-slate-400">Tracked incidents</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.14em] text-slate-300">Status</div>
            <div className="text-2xl font-bold text-emerald-300">Operational</div>
            <div className="text-sm text-slate-400">All systems nominal</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="text-sm font-semibold">Recent users</div>
            <div className="space-y-2 text-sm">
              {mockUsers.map((u) => (
                <div key={u.email} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 flex justify-between">
                  <div>
                    <div className="font-semibold">{u.email}</div>
                    <div className="text-slate-400">Role: {u.role}</div>
                  </div>
                  <div className="text-slate-400 text-xs">{u.created_at}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="text-sm font-semibold">Recent disasters</div>
            <div className="space-y-2 text-sm">
              {mockDisasters.map((d) => (
                <div key={d.title} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 flex justify-between">
                  <div>
                    <div className="font-semibold">{d.title}</div>
                    <div className="text-slate-400">Severity: {d.severity}</div>
                  </div>
                  <div className="text-slate-400 text-xs">{d.occurred_at}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
