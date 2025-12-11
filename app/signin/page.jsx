'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = params.get('role') === 'admin' ? 'admin' : 'user';
  const [role, setRole] = useState(initialRole);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
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
      const text = await res.text();
      const body = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setError(body?.error || 'Login failed');
        setMessage('');
      } else {
        setMessage(body?.message || (role === 'admin' ? 'Admin login successful.' : 'User login successful.'));
        setError('');
        if (typeof window !== 'undefined') {
          if (role === 'user' && body?.user) {
            window.localStorage.setItem('sessionUser', JSON.stringify(body.user));
          } else if (role === 'admin') {
            window.localStorage.removeItem('sessionUser');
          }
        }
        form?.reset?.();
        setRole(initialRole);
        router.push(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
      }
    } catch (err) {
      setError(err?.message || 'Network or server error');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-yellow-50 text-red-800 flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-red-500 font-semibold">Sign in</div>
          <h1 className="text-3xl font-bold tracking-tight text-red-700">Log in to your account</h1>
          <p className="text-red-600 text-sm">Choose a role; we’ll check the matching table.</p>
        </div>

        <form
          className="space-y-4 bg-white border border-red-200 rounded-2xl p-5 shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <div className="text-sm text-red-800">Role</div>
            <div className="flex gap-4">
              {[
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm text-red-900">
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={role === opt.value}
                    onChange={() => setRole(opt.value)}
                    className="accent-red-600"
                    required
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-red-600">Admins authenticate against the admin table; users against the user table.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-red-800">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-red-800">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500 disabled:opacity-70 transition"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>

          {message && <div className="text-sm text-emerald-600">{message}</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="text-center text-sm flex items-center justify-center gap-3 text-red-700">
            <Link href="/" className="underline hover:text-red-900">
              Back to home
            </Link>
            <span className="text-red-400">•</span>
            <Link href="/register" className="underline hover:text-red-900 font-semibold">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
