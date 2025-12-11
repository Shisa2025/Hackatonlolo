'use client';

import Link from 'next/link';
import { useState } from 'react';
import { animate, createTimeline, stagger } from 'animejs';

export default function AdminDashboard() {
  const [clicks, setClicks] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [secretError, setSecretError] = useState('');

  const handleCursorClick = () => {
    const next = clicks + 1;
    if (next >= 7) {
      setClicks(0);
      setShowModal(true);
    } else {
      setClicks(next);
    }
  };

  const handleSecretSubmit = (e) => {
    e.preventDefault();
    if (secretInput.trim() === 'kaijuGo') {
      setSecretError('');
      setShowModal(false);
      window.location.href = '/kaiju';
    } else {
      setSecretError('Keyword incorrect');
    }
  };

  return (
    <main className="min-h-screen bg-yellow-50 text-slate-100 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-red-900 font-medium">Admin Dashboard</div>
            <h1 className="text-7xl font-bold tracking-tight text-red-700 py-2">Control Panel</h1>
            <p className="text-red-900 text-m py-2 font-medium">Manage users and review disaster records.</p>
          </div>
          <Link
            href="/signin?role=admin"
            className="px-4 py-2 rounded-xl border border-white/20 bg-red-700 text-sm hover:border-white/40 font-medium"
          >
            Sign out / switch
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/admin/users"
            className="rounded-2xl border border-white/10 bg-red-700 p-5 hover:border-white/30 transition space-y-2"
          >
            <div className="text-sm uppercase tracking-[0.1em] text-white/80">Manage</div>
            <div className="text-xl font-semibold">User management</div>
            <p className="text-sm text-white/80 font-medium">Review users and update pending accounts.</p>
          </Link>

          <Link
            href="/admin/disaster-type"
            className="rounded-2xl border border-white/10 bg-red-700 p-5 hover:border-white/30 transition space-y-2"
          >
            <div className="text-sm uppercase tracking-[0.1em] text-white/80">Manage</div>
            <div className="text-xl font-semibold">Create disaster types</div>
            <p className="text-sm text-white/80 font-medium">Create and maintain disaster types.</p>
          </Link>

          <Link
            href="/admin/disasters"
            className="rounded-2xl border border-white/10 bg-red-700 p-5 hover:border-white/30 transition space-y-2"
          >
            <div className="text-sm uppercase tracking-[0.1em] text-white/80">Manage</div>
            <div className="text-xl font-semibold">Disaster management</div>
            <p className="text-sm text-white/80 font-medium">Review disasters and update status.</p>
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCursorClick}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full border border-white/20 bg-white/80 shadow-lg hover:shadow-xl transition flex items-center justify-center overflow-hidden"
        aria-label="Secret cursor trigger"
      >
        <img src="/kaiju/index/kaijyu1.png" alt="cursor hint" className="h-10 w-10 object-contain" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 shadow-2xl p-6 space-y-4">
            <div className="text-lg font-semibold">Enter keyword</div>
            <form className="space-y-3" onSubmit={handleSecretSubmit}>
              <input
                type="text"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Type keyword..."
                autoFocus
              />
              {secretError && <div className="text-sm text-red-600">{secretError}</div>}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSecretError('');
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-700 text-white font-semibold hover:bg-red-800"
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
