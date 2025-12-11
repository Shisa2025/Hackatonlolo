'use client';

import Link from 'next/link';
import {animate, createTimeline} from 'animejs';
export default function Home() {
  return (
    <main className="min-h-screen bg-yellow-50 text-red-700 flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-red-500 font-semibold">Disaster Simulation</div>
        <h1 className="text-8xl font-bold tracking-tight">Welcome</h1>
        <p className="text-red-500">Choose an action to continue.</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="px-5 py-3 rounded-xl border border-red-700 bg-sky-200 text-slate-900 font-semibold shadow hover:bg-white"
          >
            Get started
          </Link>
          <Link
            href="/more-info"
            className="px-5 py-3 rounded-xl bg-sky-200 border border-red-700 text-slate-900 font-semibold hover:bg-white"
          >
            More info
          </Link>
        </div>
      </div>
    </main>
  );
}
