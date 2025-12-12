'use client';

import { useEffect, useState } from 'react';
import Picker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data';
import Link from 'next/link';

export default function CreateDisasterTypePage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedCursor, setSelectedCursor] = useState('');

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
      emoji: selectedEmoji || null,
      emoji_cursor: selectedCursor || null,
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
        setSelectedEmoji('');
        setSelectedCursor('');
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
    <main className="min-h-screen bg-yellow-50 text-red-700-100 px-6 py-10 flex justify-center ">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-m font-bold uppercase tracking-[0.2em] text-red-700">Admin</div>
            <h1 className="text-3xl font-bold tracking-tight text-red-700">Create Disaster Type</h1>
            <p className="text-red-700 font-bold text-m">Add a new disaster type to the system.</p>
          </div>
        </div>

        <form
          className="space-y-4 bg-red-700 border border-white/10 rounded-2xl p-5 shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <label className="block text-sm text-white font-semibold">Name</label>
            <input
              name="name"
              type="text"
              required
              minLength={2}
              className="w-full p-3 rounded-md bg-white text-black placeholder-gray-500"
              placeholder="e.g., Earthquake"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white font-semibold">Description</label>
            <textarea
              name="description"
              rows={3}
              className="w-full p-3 rounded-md bg-white text-black placeholder-gray-500"
              placeholder="Optional notes"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white font-semibold">Global emoji (searchable)</label>
            <div className="rounded-xl border border-white/20 bg-white/5 p-2">
              <Picker
                data={emojiData}
                onEmojiSelect={(emoji) => {
                  setSelectedEmoji(emoji?.native || '');
                  setSelectedCursor(emoji?.id || emoji?.shortcodes || '');
                }}
                previewPosition="none"
                theme="light"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-white/90 bg-white/10 rounded-md px-3 py-2">
              <div>
                Selected: {selectedEmoji ? `${selectedEmoji} (${selectedCursor || 'no cursor'})` : 'None'}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedEmoji('');
                  setSelectedCursor('');
                }}
                className="underline text-white hover:text-red-100"
              >
                Clear
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full p-3 rounded-md bg-white text-black placeholder-gray-500 font-bold"
          >
            {submitting ? 'Creating...' : 'Create Disaster Type'}
          </button>

          {message && <div className="text-sm text-emerald-300">{message}</div>}
          {error && <div className="text-sm text-red-300">{error}</div>}
        </form>

        <div className="rounded-2xl border border-white/10 bg-red-700 p-5 shadow-xl space-y-3">
          <div className="text-m font-semibold text-white">Existing disaster types</div>
          {loadingTypes && <div className="text-sm text-red-700">Loading...</div>}
          {!loadingTypes && types.length === 0 && <div className="text-sm text-red-700">No disaster types yet.</div>}
          {!loadingTypes && types.length > 0 && (
            <div className="space-y-2 text-sm">
              {types.map((t) => (
                <div key={t.id ?? t.name} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <div className="font-semibold">{t.emoji ? `${t.emoji} ${t.name}` : t.name}</div>
                  {t.emoji_cursor && <div className="text-xs text-gray-200">Cursor: {t.emoji_cursor}</div>}
                  {t.description && <div className="text-gray-400">{t.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
