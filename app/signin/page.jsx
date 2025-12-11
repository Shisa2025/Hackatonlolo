'use client';

import { useState } from 'react';

export default function SignInPage() {
  const [role, setRole] = useState('user');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    const data = new FormData(e.currentTarget);
    const payload = {
      email: data.get('email'),
      password: data.get('password'),
      role,
    };

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body?.error || 'Login failed');
        setMessage('');
      } else {
        setMessage(body?.message || (role === 'admin' ? 'Admin login successful.' : 'User login successful.'));
        setError('');
        e.currentTarget.reset();
        setRole('user');
      }
    } catch (err) {
      setError('Network or server error');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Sign in</div>
          <h1 className="text-3xl font-bold tracking-tight">Log in to your account</h1>
          <p className="text-slate-300 text-sm">Choose a role first; login checks the corresponding table.</p>
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
            <p className="text-xs text-slate-400">Admins authenticate against the admin table; users against the user table.</p>
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

          <div className="space-y-2">
            <label className="block text-sm text-slate-200">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-slate-100 text-slate-900 font-semibold hover:bg-white disabled:opacity-70"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>

          {message && <div className="text-sm text-emerald-300">{message}</div>}
          {error && <div className="text-sm text-red-300">{error}</div>}
        </form>
      </div>
    </main>
  );
}
