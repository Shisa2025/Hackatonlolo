'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminDashboard() {
  const router = useRouter();
  const [tapCount, setTapCount] = useState(0);

  const handleKaijuTap = () => {
    const next = tapCount + 1;
    if (next >= 7) {
      setTapCount(0);
      const key = window.prompt('Enter keyword to proceed:');
      if (key === 'kaijuGo') {
        router.push('/kaiju');
      }
    } else {
      setTapCount(next);
    }
  };

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
            href="/admin/users"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/30 transition space-y-2"
          >
            <div className="text-sm uppercase tracking-[0.14em] text-slate-300">Manage</div>
            <div className="text-xl font-semibold">User management</div>
            <p className="text-sm text-slate-400">Review users and update pending accounts.</p>
          </Link>

          <Link
            href="/admin/disaster-type"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/30 transition space-y-2"
          >
            <div className="text-sm uppercase tracking-[0.14em] text-slate-300">Manage</div>
            <div className="text-xl font-semibold">Disaster type management</div>
            <p className="text-sm text-slate-400">Create and maintain disaster types.</p>
          </Link>

          <Link
            href="/admin/disasters"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/30 transition space-y-2"
          >
            <div className="text-sm uppercase tracking-[0.14em] text-slate-300">Manage</div>
            <div className="text-xl font-semibold">Disaster management</div>
            <p className="text-sm text-slate-400">Review disasters and update status.</p>
          </Link>
        </div>
      </div>
      <button
        type="button"
        aria-label="Hidden kaiju access"
        onClick={handleKaijuTap}
        className="fixed right-4 bottom-4 h-12 w-12 rounded-full border border-white/20 bg-white/10 text-lg text-slate-100 opacity-60 hover:opacity-100 shadow-[0_0_0_6px_rgba(255,255,255,0.08)] transition"
        title=" "
      >
        ☄️
      </button>
    </main>
  );
}
