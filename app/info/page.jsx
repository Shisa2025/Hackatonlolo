'use client';

import Link from 'next/link';

export default function InfoPage() {
  return (
    <main className="min-h-screen bg-yellow-50 text-red-800 flex items-center justify-center px-6">
      <div className="max-w-3xl w-full space-y-4 bg-white border border-red-200 rounded-2xl p-6 shadow-lg">
        <div className="text-xs uppercase tracking-[0.2em] text-red-500 font-semibold">More info</div>
        <h1 className="text-3xl font-bold tracking-tight text-red-700">Disaster Information Sharing</h1>
        <p className="text-red-700/90 leading-relaxed">
          This platform lets you share real-time disaster incidents to help others stay safe and avoid danger.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-red-700/90">
          <li>Submit accurate category, location, and details so others can react quickly.</li>
          <li>Do not post the same disaster type within 1km in a short time window to prevent spam and confusion.</li>
          <li>Fake or abusive reports may lead to account restrictions or a ban.</li>
        </ul>
        <div className="flex gap-3">
          <Link
            href="/user/map"
            className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500"
          >
            Report a disaster
          </Link>
          <Link
            href="/mainpage"
            className="px-4 py-2 rounded-xl border border-red-300 text-red-700 font-semibold hover:bg-red-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
