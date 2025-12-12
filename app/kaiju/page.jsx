"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#210000] via-[#3a0000] to-[#5a0c0c] text-slate-100 relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 py-12 flex flex-col gap-10">
        <div className="rounded-2xl border border-red-400/60 bg-red-500/25 text-white px-4 py-3 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-sm font-semibold uppercase tracking-[0.18em]">Urgent Broadcast</div>
          <div className="text-sm sm:text-base font-medium">
            Emergency situation, emergency situation. Deploy perimeter now and loop shelter routes.
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-white animate-ping" />
            Live
          </div>
        </div>

        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl overflow-hidden h-96 sm:h-[28rem] lg:h-[32rem]">
          <Image
            src="/kaiju/index/kaijyu1.png"
            alt="Kaiju visual"
            fill
            className="object-contain"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#200000]/70 via-[#300000]/25 to-transparent" />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-2xl p-8 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1">
              <div className="text-sm uppercase tracking-[0.18em] text-white/80">Kaiju Response</div>
              <div className="text-3xl font-semibold text-white">Welcome to the hidden entrance!</div>
              <p className="text-lg text-white/80">
                To avoid public panic, the team is quietly executing the monster countermeasures behind this portal.
              </p>
            </div>
            <Link
              href="/kaiju/synopsis"
              className="px-6 py-3 rounded-2xl border border-white/40 text-white/90 text-lg font-semibold hover:border-white/70 hover:text-white"
            >
              Quick Tour
            </Link>
          </div>

          <div className="rounded-2xl border border-red-200/40 bg-red-500/20 p-6 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.16em] text-white/80">Emergency</div>
              <div className="text-2xl font-semibold text-white">The city is under attack — proceed to repel the kaiju.</div>
              <p className="text-sm text-white/85 mt-2">
                Immediate response required. Engage the counter-strike interface to push the threat back.
              </p>
            </div>
            <Link
              href="/kaiju/interaction"
              className="px-6 py-3 rounded-2xl bg-red-600 text-white text-lg font-semibold border border-red-300/60 hover:bg-red-500"
            >
              Repel the Kaiju
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
