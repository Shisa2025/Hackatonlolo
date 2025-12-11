'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const mockEvents = [
  { title: 'Evac drill', severity: 'medium', occurred_at: '2025-04-10 10:00' },
  { title: 'Sensor test', severity: 'low', occurred_at: '2025-04-12 08:15' },
];

export default function UserDashboard() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('sessionUser');
      if (raw) setUserInfo(JSON.parse(raw));
    } catch {
      // silent
    }
  }, []);

  const status = userInfo?.account_status ?? 'active';
  const role = userInfo?.role ?? 'user';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">User Dashboard</div>
            <h1 className="text-3xl font-bold tracking-tight">Your Overview</h1>
            <p className="text-slate-300 text-sm">Account status and recent disaster activity.</p>
          </div>
          <Link
            href="/signin?role=user"
            className="px-4 py-2 rounded-xl border border-white/20 text-sm hover:border-white/40"
          >
            Sign out / switch
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.14em] text-slate-300">Account</div>
          <div className="text-xl font-semibold mt-1">{userInfo?.user_name || 'User name unavailable'}</div>
          <div className="text-sm text-slate-400">{userInfo?.email || 'Email unavailable'}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.14em] text-slate-300">Status</div>
            <div className="text-2xl font-bold capitalize">{status}</div>
            <div className="text-sm text-slate-400">Account status</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.14em] text-slate-300">Role</div>
            <div className="text-2xl font-bold capitalize">{role}</div>
            <div className="text-sm text-slate-400">Assigned role</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.14em] text-slate-300">Events</div>
            <div className="text-2xl font-bold">{mockEvents.length}</div>
            <div className="text-sm text-slate-400">Recent disaster items</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="text-sm font-semibold">Recent disasters</div>
          <div className="space-y-2 text-sm">
            {mockEvents.map((d) => (
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
    </main>
  );
}
