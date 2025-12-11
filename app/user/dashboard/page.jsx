'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const mockEvents = [
  { title: 'Evac drill', severity: 'medium', occurred_at: '2025-04-10 10:00' },
  { title: 'Sensor test', severity: 'low', occurred_at: '2025-04-12 08:15' },
];

export default function UserDashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('sessionUser');
      if (raw) setUserInfo(JSON.parse(raw));
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!userInfo?.id && !userInfo?.email) return;
      try {
        const params = new URLSearchParams();
        if (userInfo.id) params.set('id', userInfo.id);
        else if (userInfo.email) params.set('email', userInfo.email);
        const res = await fetch(`/api/user/status?${params.toString()}`, { method: 'GET' });
        const text = await res.text();
        const body = text ? JSON.parse(text) : {};
        if (res.ok && body?.user) {
          const merged = { ...body.user, can_create_disaster: body.can_create_disaster };
          setUserInfo(merged);
          window.localStorage.setItem('sessionUser', JSON.stringify(merged));
          if (body.user.account_status === 'banned') {
            setStatusMessage('Your account has been banned. Access is limited.');
          } else if (body.user.account_status === 'pending') {
            setStatusMessage('Your account is pending; some actions are disabled.');
          } else {
            setStatusMessage('');
          }
        }
      } catch {
        // silent
      }
    };
    fetchStatus();
  }, [userInfo?.id, userInfo?.email]);

  const status = userInfo?.account_status ?? 'active';
  const role = userInfo?.role ?? 'user';
  const canCreate = Boolean(userInfo?.can_create_disaster ?? status === 'active');

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

        {statusMessage && (
          <div className="rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            {statusMessage}
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-100">Report a disaster</div>
            <div className="text-xs text-slate-400">
              {canCreate
                ? 'Ready to file a new incident when available.'
                : status === 'banned'
                  ? 'Banned accounts cannot create or access new incidents.'
                  : 'Pending accounts cannot create new disasters.'}
            </div>
          </div>
          <button
            type="button"
            disabled={!canCreate}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              canCreate
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title={canCreate ? 'Coming soon' : 'Awaiting approval to create incidents'}
          >
            {canCreate ? 'Create (coming soon)' : 'Creation locked'}
          </button>
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
