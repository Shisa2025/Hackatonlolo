"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

export default function UserMapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#CBEEF3] text-[#1d1d1d]">
      <header className="p-6 border-b border-[#A31D1D] bg-white shadow-sm">
        <h1 className="text-2xl font-semibold" style={{ color: "#A31D1D" }}>
          Singapore Disaster Map
        </h1>
        <p className="text-sm text-[#6D2323] mt-1">
          Pick a spot to report an incident (coming soon)
        </p>
      </header>

      <main className="flex-1 p-4">
        <div className="h-full rounded-xl overflow-hidden shadow-lg border border-[#E5D0AC] bg-white">
          <MapView />
        </div>
      </main>
    </div>
  );
}
