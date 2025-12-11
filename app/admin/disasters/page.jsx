"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { animate, stagger, spring } from "animejs";

export default function AdminDisasterTypesPage() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // --- load existing disaster types ---
  const loadTypes = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  // --- Anime.js animations ---

  // animate form when page loads
  useEffect(() => {
    animate(".type-form", {
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 700,
      easing: spring({ bounce: 0.3, duration: 900 }),
    });
  }, []);

  // animate list items whenever types change
  useEffect(() => {
    if (!types.length) return;
    animate(".type-item", {
      opacity: [0, 1],
      translateY: [-16, 0],
      duration: 600,
      delay: stagger(120),
      easing: "outCubic",
    });
  }, [types]);

  // animate success chip whenever message changes
  useEffect(() => {
    if (!message) return;
    animate("#type-success", {
      opacity: [0, 1],
      translateY: [-10, 0],
      scale: [0.9, 1],
      duration: 450,
      easing: "outCubic",
    });
  }, [message]);

  // --- create new type ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/admin/disaster-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
        }),
      });

      const text = await res.text();
      const body = text ? JSON.parse(text) : {};

      if (!res.ok) {
        setError(body?.error || "Failed to create disaster type");
      } else {
        setMessage(body?.message || "Disaster type created.");
        setName("");
        setDescription("");
        loadTypes();
      }
    } catch (err) {
      setError(err?.message || "Network or server error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Admin
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create Disaster Type
            </h1>
            <p className="text-slate-300 text-sm">
              Add a new disaster type to the system.
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="text-sm text-slate-200 underline"
          >
            Back to dashboard
          </Link>
        </div>

        {/* messages */}
        {message && (
          <div
            id="type-success"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs text-emerald-200 border border-emerald-400/50"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {message}
          </div>
        )}
        {error && (
          <div className="text-sm text-red-300 border border-red-500/40 bg-red-500/10 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* form card */}
        <section className="type-form rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4 shadow-lg transition hover:border-white/20 hover:shadow-[0_0_40px_rgba(242,74,114,0.25)]">
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-200">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/60 transition"
                placeholder="e.g., Earthquake"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-200">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[96px] rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/60 transition resize-none"
                placeholder="Optional notes"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full rounded-2xl bg-[#F24A72] py-3 text-sm font-semibold text-white shadow-md transition-transform duration-150 hover:bg-[#FF5C85] active:translate-y-[1px] active:shadow-sm disabled:opacity-60"
            >
              {creating ? "Creating…" : "Create Disaster Type"}
            </button>
          </form>
        </section>

        {/* existing types */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Existing disaster types</div>
            {loading && (
              <div className="text-xs text-slate-400">Loading…</div>
            )}
          </div>

          {!loading && types.length === 0 && (
            <div className="text-sm text-slate-400">
              No disaster types found yet.
            </div>
          )}

          {!loading && types.length > 0 && (
            <div className="space-y-2">
              {types.map((t) => (
                <div
                  key={t.id}
                  className="type-item rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 flex flex-col gap-1 transition hover:border-pink-400/60 hover:bg-white/[0.06]"
                >
                  <div className="font-semibold text-slate-50">
                    {t.name || "Untitled type"}
                  </div>
                  <div className="text-xs text-slate-400">
                    {t.description || "No description provided."}
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

