'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [role, setRole] = useState('user');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);
    setMessage('');
    setError('');

    const data = new FormData(e.currentTarget);
    const payload = {
      email: data.get('email'),
      user_name: role === 'user' ? data.get('user_name') : undefined,
      password: data.get('password'),
      role,
    };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      const body = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setError(body?.error || 'Registration failed');
        setMessage('');
      } else {
        setMessage(body?.message || (role === 'admin' ? 'Admin registration successful.' : 'User registration successful.'));
        setError('');
        form?.reset?.();
        setRole('user');
      }
    } catch (err) {
      setError(err?.message || 'Network or server error');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Register</div>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-slate-300 text-sm">Pick a role first; fields adapt based on the selection.</p>
        </div>

        <form
          className="space-y-4 bg-slate-900/80 border border-white/10 rounded-2xl p-5 shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <div className="text-sm text-slate-200">Role</div>
            <div className="flex gap-4">
              {[
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={role === opt.value}
                    onChange={() => setRole(opt.value)}
                    className="accent-red-500"
                    required
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-400">Admins go to the admin table; users go to the user table.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-200">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-100"
              placeholder="you@example.com"
            />
          </div>

          {role === 'user' && (
            <div className="space-y-2">
              <label className="block text-sm text-slate-200">Username</label>
              <input
                name="user_name"
                type="text"
                required
                minLength={3}
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-100"
                placeholder="choose a username"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm text-slate-200">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-70"
          >
            {submitting ? 'Registering...' : 'Register'}
          </button>

          {message && <div className="text-sm text-emerald-300">{message}</div>}
          {error && <div className="text-sm text-red-300">{error}</div>}

          <div className="text-center text-sm">
            <Link href="/" className="text-slate-300 underline hover:text-white">
              Back to home
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
