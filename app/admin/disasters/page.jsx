"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { animate, createTimeline } from "animejs";

export default function AdminDisasterTypesPage() {
  const [types, setTypes] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [loadingDisasters, setLoadingDisasters] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [filterTypeId, setFilterTypeId] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [statusUpdating, setStatusUpdating] = useState({});
  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const yyyy = date.getUTCFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };
  const startOfDayUTC = (value) => {
    if (!value) return "";
    const d = new Date(`${value}T00:00:00Z`);
    return Number.isNaN(d.getTime()) ? value : d.toISOString();
  };
  const endOfDayUTC = (value) => {
    if (!value) return "";
    const d = new Date(`${value}T23:59:59Z`);
    return Number.isNaN(d.getTime()) ? value : d.toISOString();
  };

  // --- load existing disaster types ---
  const loadTypes = async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/disaster-type", { method: "GET" });
      const text = await res.text();
      const body = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setError(body?.error || "Failed to load disaster types");
      } else {
        setTypes(body?.disaster_types || []);
      }
    } catch (err) {
      setError(err?.message || "Network or server error");
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  // load disasters with filters
  const loadDisasters = async () => {
    setLoadingDisasters(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterTypeId !== "all" && filterTypeId) params.set("typeId", filterTypeId);
      if (filterFrom) params.set("from", startOfDayUTC(filterFrom));
      if (filterTo) params.set("to", endOfDayUTC(filterTo));

      const res = await fetch(`/api/admin/disasters?${params.toString()}`, {
        method: "GET",
      });
      const text = await res.text();
      const body = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setError(body?.error || "Failed to load disasters");
      } else {
        setDisasters(body?.disasters || []);
      }
    } catch (err) {
      setError(err?.message || "Network or server error");
    } finally {
      setLoadingDisasters(false);
    }
  };

  useEffect(() => {
    loadDisasters();
  }, [filterTypeId, filterFrom, filterTo]);

  // --- Anime.js animations ---

  // animate page when loads
  useEffect(() => {
    const tl = createTimeline({});
    tl.add("#disaster-subheading", {
      opacity: [0, 1],
      translateY: [32, 0],
      duration: 700,
      easing: "easeOutQuad",
    });
    tl.add(
      "#disaster-heading",
      {
        opacity: [0, 1],
        translateY: [32, 0],
        duration: 700,
        easing: "easeOutQuad",
      },
      "-=550"
    );
    tl.add(
      "#disaster-copy",
      {
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 650,
        easing: "easeOutQuad",
      },
      "-=550"
    );
    tl.add(
      "#disaster-back",
      {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 550,
        easing: "easeOutQuad",
      },
      "-=500"
    );
    tl.add(
      "#disaster-filter",
      {
        opacity: [0, 1],
        translateY: [28, 0],
        duration: 650,
        easing: "easeOutQuad",
      },
      "-=450"
    );
    tl.add(
      "#disaster-list",
      {
        opacity: [0, 1],
        translateY: [28, 0],
        duration: 700,
        easing: "easeOutQuad",
      },
      "-=650"
    );
  }, []);

  // animate success chip whenever message changes
  useEffect(() => {
    if (!message) return;
    animate("#type-success", {
      opacity: [0, 1],
      translateY: [-10, 0],
      scale: [0.9, 1],
      duration: 450,
      easing: "easeOutCubic",
    });
  }, [message]);

  // --- update disaster status ---
  const handleStatusChange = async (id, status) => {
    setStatusUpdating((prev) => ({ ...prev, [id]: true }));
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/disasters", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const text = await res.text();
      const body = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setError(body?.error || "Failed to update status");
      } else {
        setMessage(body?.message || "Status updated.");
        setDisasters((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: status } : d))
        );
      }
    } catch (err) {
      setError(err?.message || "Network or server error");
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <main className="min-h-screen bg-yellow-50 text-red-900 px-6 py-10">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div
              id="disaster-subheading"
              className="text-xs uppercase tracking-[0.15em] text-red-800 font-medium opacity-0"
            >
              Admin
            </div>
            <h1
              id="disaster-heading"
              className="text-7xl font-bold tracking-tight text-red-700 opacity-0"
            >
              Disaster Management
            </h1>
            <p
              id="disaster-copy"
              className="text-base text-red-800 font-medium opacity-0"
            >
              Review and update disaster records with filters and status controls.
            </p>
          </div>
        </div>

        {/* messages */}
        {message && (
          <div
            id="type-success"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs text-emerald-800 border border-emerald-300 shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {message}
          </div>
        )}
        {error && (
          <div className="text-sm text-red-700 border border-red-300 bg-red-100 rounded-lg px-3 py-2 shadow-sm">
            {error}
          </div>
        )}

        {/* filter card */}
        <section
          id="disaster-filter"
          className="rounded-3xl border border-red-200 bg-white p-5 shadow-xl text-sm text-red-900 space-y-3 opacity-0"
        >
          <div className="font-semibold text-red-800">Filter disasters</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-red-700">
                Category
              </label>
              <select
                value={filterTypeId}
                onChange={(e) => setFilterTypeId(e.target.value)}
                className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              >
                <option value="all">All categories</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-red-700">
                From date
              </label>
              <input
                type="date"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-red-700">
                To date
              </label>
              <input
                type="date"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              />
            </div>
          </div>
          {(filterTypeId !== "all" || filterFrom || filterTo) && (
            <button
              type="button"
              onClick={() => {
                setFilterTypeId("all");
                setFilterFrom("");
                setFilterTo("");
              }}
              className="text-xs font-semibold text-red-700 underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </section>

        {/* disaster list */}
        <section
          id="disaster-list"
          className="rounded-3xl border border-red-200 bg-white p-5 shadow-xl space-y-3 text-sm opacity-0"
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-red-800">Disaster records</div>
            {loadingDisasters && (
              <div className="text-xs text-red-700">Loading...</div>
            )}
          </div>

          {!loadingDisasters && disasters.length === 0 && (
            <div className="text-sm text-red-700">
              No disasters match the current filters.
            </div>
          )}

          {!loadingDisasters && disasters.length > 0 && (
            <div className="space-y-3">
              {disasters.map((d) => (
                <div
                  key={d.id}
                  className="rounded-2xl border border-red-100 bg-red-50 p-4 space-y-2 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-red-800">{d.title || "Untitled disaster"}</div>
                    <div className="text-xs text-red-700">
                      {d.disaster_type_name || "Uncategorized"}
                    </div>
                  </div>
                  <div className="text-xs text-red-700">
                    {d.description || "No description provided."}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-red-700">
                    {d.location && <span className="font-semibold">Location:</span>} {d.location}
                    {d.occurred_at && (
                      <span className="font-semibold">
                        Occurred: {formatDate(d.occurred_at)}
                      </span>
                    )}
                    {d.severity && <span className="font-semibold">Severity: {d.severity}</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-red-800">
                    <span className="font-semibold">Status</span>
                    <select
                      value={d.status || "unverified"}
                      onChange={(e) => handleStatusChange(d.id, e.target.value)}
                      disabled={statusUpdating[d.id]}
                      className="rounded-lg border border-red-200 bg-white px-3 py-1 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                    >
                      <option value="unverified">Unverified</option>
                      <option value="verified">Verified</option>
                      <option value="fake">Fake</option>
                    </select>
                    {statusUpdating[d.id] && (
                      <span className="text-red-600">Updating...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
