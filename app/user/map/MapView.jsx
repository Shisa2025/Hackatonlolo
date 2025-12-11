"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const singaporeCenter = [1.3521, 103.8198];

export default function MapView({ onPositionSelect }) {
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    console.log("MapView mounted");
  }, []);

  function ClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedPosition({ lat, lng });
        console.log({ lat, lng });
        if (onPositionSelect) onPositionSelect({ lat, lng });
      },
    });
    return null;
  }

  return (
    <div className="relative h-full w-full min-h-[500px]">
      <div className="absolute left-3 top-3 z-[1000] rounded bg-white/80 px-3 py-1 text-sm text-[#A31D1D] shadow">
        Map is rendering
      </div>
      <MapContainer
        center={singaporeCenter}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
        style={{ minHeight: "500px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler />
        {selectedPosition ? (
          <CircleMarker
            center={[selectedPosition.lat, selectedPosition.lng]}
            radius={8}
            pathOptions={{
              color: "#A31D1D",
              fillColor: "#A31D1D",
              fillOpacity: 0.9,
            }}
          />
        ) : null}
      </MapContainer>
    </div>
  );
}
