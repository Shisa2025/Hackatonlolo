"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const singaporeCenter = [1.3521, 103.8198];

export default function MapView() {
  const [selectedPosition, setSelectedPosition] = useState(null);

  function ClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedPosition({ lat, lng });
        console.log({ lat, lng });
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={singaporeCenter}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler />
      {selectedPosition ? <Marker position={selectedPosition} /> : null}
    </MapContainer>
  );
}
