"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ReportForm from "./ReportForm";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

export default function UserMapPage() {
  const [selectedPosition, setSelectedPosition] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-yellow-50 text-red-900">
      <header className="p-6 border-b border-red-200 bg-white shadow-sm">
        <h1 className="text-2xl font-semibold text-red-700">
          Singapore Disaster Map
        </h1>
        <p className="text-sm text-red-800 mt-1">
          Pick a spot to report an incident and submit it to the disaster database.
        </p>
      </header>

      <main className="flex-1 p-4">
        <div className="h-full min-h-[600px] rounded-xl overflow-hidden shadow-lg border border-red-200/70 bg-white">
          <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="h-full">
              <MapView onPositionSelect={(pos) => setSelectedPosition(pos)} />
            </div>
            <div className="h-full bg-amber-50 p-4">
              {selectedPosition ? (
                <ReportForm
                  position={selectedPosition}
                  onClose={() => setSelectedPosition(null)}
                />
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-red-200/70 text-red-800">
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
