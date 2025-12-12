"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const singaporeCenter = [1.3521, 103.8198];

const todayISO = () => new Date().toISOString().slice(0, 10);

function formatDate(val) {
  if (!val) return "Unknown time";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "Unknown time";
  return d.toLocaleString();
}

export default function DisasterMap() {
  const [disasters, setDisasters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(() => ({
    categoryId: "",
    from: todayISO(),
    to: todayISO(),
  }));
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const iconCache = useMemo(() => new Map(), []);

  const getIcon = (emoji) => {
    const key = emoji || "⚠️";
    if (iconCache.has(key)) return iconCache.get(key);
    const icon = L.divIcon({
      className: "disaster-emoji-marker",
      html: `<div style="font-size:24px; line-height:1;">${key}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    iconCache.set(key, icon);
    return icon;
  };

  // Load categories once
  useEffect(() => {
    let active = true;
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/user/categories");
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        if (!active) return;
        setCategories(data ?? []);
      } catch (err) {
        if (active) setCategories([]);
      }
    };
    loadCategories();
    return () => {
      active = false;
    };
  }, []);

  // Load disasters when filters change
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.categoryId) params.set("typeId", filters.categoryId);
        if (filters.from) params.set("from", filters.from);
        if (filters.to) params.set("to", filters.to);
        const res = await fetch(`/api/user/disasters?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load disasters");
        const data = await res.json();
        if (!active) return;
        setDisasters(data.disasters ?? []);
        setError("");
      } catch (err) {
        if (active) setError(err.message || "Could not load map data");
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [filters.categoryId, filters.from, filters.to]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="relative rounded-2xl border border-[#E5D0AC] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.14em] text-[#6D2323]">Live map</div>
          <div className="text-lg font-semibold text-[#A31D1D]">User-reported disasters</div>
        </div>
        {error ? (
          <div className="rounded-md bg-[#F26A8D]/20 px-3 py-1 text-xs text-[#A31D1D] border border-[#E5D0AC]">
            {error}
          </div>
        ) : (
          <div className="text-xs text-[#6D2323]">{disasters.length} markers</div>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-3 text-sm">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.14em] text-[#6D2323]">Category</span>
          <select
            value={filters.categoryId}
            onChange={(e) => updateFilter("categoryId", e.target.value)}
            className="rounded border border-[#E5D0AC] px-2 py-1 text-[#1d1d1d] focus:border-[#A31D1D] focus:outline-none"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon ? `${c.icon} ` : ""}{c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.14em] text-[#6D2323]">From</span>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => updateFilter("from", e.target.value)}
            className="rounded border border-[#E5D0AC] px-2 py-1 text-[#1d1d1d] focus:border-[#A31D1D] focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.14em] text-[#6D2323]">To</span>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => updateFilter("to", e.target.value)}
            className="rounded border border-[#E5D0AC] px-2 py-1 text-[#1d1d1d] focus:border-[#A31D1D] focus:outline-none"
          />
        </div>
      </div>

      <div className="h-[460px] overflow-hidden rounded-xl border border-[#E5D0AC]">
        {ready ? (
          <MapContainer
            key="dashboard-map"
            center={singaporeCenter}
            zoom={12}
            scrollWheelZoom
            className="h-full w-full"
            style={{ minHeight: "400px" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {disasters.map((d) => (
              <Marker
                key={d.id}
                position={[d.lat, d.lng]}
                icon={getIcon(d.icon)}
                eventHandlers={{
                  click: () => setSelected(d),
                }}
              />
            ))}
          </MapContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#6D2323]">
            Loading map...
          </div>
        )}
      </div>

      {selected ? (
        <div className="mt-3 rounded-xl border border-[#E5D0AC] bg-[#FFF8E1] p-3 text-sm text-[#1d1d1d] shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-[#6D2323]">
                {selected.disaster_type_name || "Disaster"}
              </div>
              <div className="text-lg font-semibold flex items-center gap-2 text-[#A31D1D]">
                <span>{selected.icon || "⚠️"}</span>
                {selected.title}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-xs text-[#6D2323] hover:text-[#A31D1D]"
            >
              Close
            </button>
          </div>
          <div className="mt-2 text-[#1d1d1d]">{selected.description}</div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#6D2323]">
            <span className="rounded bg-white px-2 py-1 border border-[#E5D0AC]">
              Severity: <span className="capitalize">{selected.severity}</span>
            </span>
            <span className="rounded bg-white px-2 py-1 border border-[#E5D0AC]">
              Status: <span className="capitalize">{selected.status}</span>
            </span>
            <span className="rounded bg-white px-2 py-1 border border-[#E5D0AC]">
              {selected.lat?.toFixed(4)}, {selected.lng?.toFixed(4)}
            </span>
            <span className="rounded bg-white px-2 py-1 border border-[#E5D0AC]">
              Occurred: {formatDate(selected.occurred_at || selected.created_at)}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
