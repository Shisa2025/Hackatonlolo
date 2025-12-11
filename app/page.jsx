'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-yellow-50 text-red-700 flex items-center justify-center px-6">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-red-500 font-semibold">DisasterBuddy</div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-red-800">Stay informed. Report safely.</h1>
          <p className="text-red-600 text-base md:text-lg">
            Crowdsourced disaster reporting to keep communities aware. Spot incidents, share verified details, and see
            them on a live map so responders and neighbors can act fast.
          </p>
          <p className="text-red-600 text-base md:text-lg">
            Built for rapid updates, trusted categories, and clear severity levels—whether you&apos;re on the ground or
            coordinating remotely.
          </p>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/signin"
            className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold shadow hover:bg-red-500 transition"
          >
            Get started
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-red-300 text-red-700 bg-white font-semibold shadow-sm hover:bg-red-50 transition"
          >
            Learn more
          </Link>
        </div>
      </div>
    </main>
  );
}
