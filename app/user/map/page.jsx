"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ReportForm from "./ReportForm";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

export default function UserMapPage() {
  const [selectedPosition, setSelectedPosition] = useState(null);

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
        <div className="h-full min-h-[600px] rounded-xl overflow-hidden shadow-lg border border-[#E5D0AC] bg-white">
          <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="h-full">
              <MapView onPositionSelect={(pos) => setSelectedPosition(pos)} />
            </div>
            <div className="h-full bg-[#F7F7F7] p-4">
              {selectedPosition ? (
                <ReportForm
                  position={selectedPosition}
                  onClose={() => setSelectedPosition(null)}
                />
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[#E5D0AC] text-[#6D2323]">
                  Click on the map to start a report
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
