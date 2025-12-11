'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CreateDisasterTypePage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const loadTypes = async () => {
    setLoadingTypes(true);
    setError('');
    try {
      const res = await fetch('/api/admin/disaster-type', { method: 'GET' });
      const text = await res.text();
      const body = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setError(body?.error || 'Failed to load disaster types');
      } else {
        setTypes(body?.disaster_types || []);
      }
    } catch (err) {
      setError(err?.message || 'Network or server error');
    } finally {
      setLoadingTypes(false);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);
    setMessage('');
    setError('');

    const data = new FormData(form);
    const payload = {
      name: data.get('name'),
      description: data.get('description'),
    };

    try {
      const res = await fetch('/api/admin/disaster-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      const body = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setError(body?.error || 'Create failed');
        setMessage('');
      } else {
        setMessage(body?.message || 'Disaster type created.');
        setError('');
        form.reset();
        loadTypes();
      }
    } catch (err) {
      setError(err?.message || 'Network or server error');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</div>
            <h1 className="text-3xl font-bold tracking-tight">Create Disaster Type</h1>
            <p className="text-slate-300 text-sm">Add a new disaster type to the system.</p>
          </div>
          <Link href="/admin/dashboard" className="text-sm text-slate-200 underline">
            Back to dashboard
          </Link>
        </div>

        <form
          className="space-y-4 bg-slate-900/80 border border-white/10 rounded-2xl p-5 shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <label className="block text-sm text-slate-200">Name</label>
            <input
              name="name"
              type="text"
              required
              minLength={2}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-100"
              placeholder="e.g., Earthquake"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-200">Description</label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-100"
              placeholder="Optional notes"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-70"
          >
            {submitting ? 'Creating...' : 'Create Disaster Type'}
          </button>

          {message && <div className="text-sm text-emerald-300">{message}</div>}
          {error && <div className="text-sm text-red-300">{error}</div>}
        </form>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl space-y-3">
          <div className="text-sm font-semibold">Existing disaster types</div>
          {loadingTypes && <div className="text-sm text-slate-400">Loading...</div>}
          {!loadingTypes && types.length === 0 && <div className="text-sm text-slate-400">No disaster types yet.</div>}
          {!loadingTypes && types.length > 0 && (
            <div className="space-y-2 text-sm">
              {types.map((t) => (
                <div key={t.id ?? t.name} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <div className="font-semibold">{t.name}</div>
                  {t.description && <div className="text-slate-400">{t.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
