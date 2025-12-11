'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STATUS_LABEL = {
  active: 'Active',
  pending: 'Pending',
  banned: 'Banned',
};

const formatDate = (value) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return value;
  }
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users', { method: 'GET' });
      const text = await res.text();
      const body = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setError(body?.error || 'Failed to load users');
      } else {
        setUsers(body?.users || []);
      }
    } catch (err) {
      setError(err?.message || 'Network or server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const setStatus = async (id, status) => {
    setUpdatingId(id);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, account_status: status }),
      });
      const text = await res.text();
      const body = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setError(body?.error || 'Update failed');
      } else {
        setMessage(body?.message || 'Status updated');
        loadUsers();
      }
    } catch (err) {
      setError(err?.message || 'Network or server error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</div>
            <h1 className="text-3xl font-bold tracking-tight">User management</h1>
            <p className="text-slate-300 text-sm">Review users and resolve pending accounts.</p>
          </div>
          <Link href="/admin/dashboard" className="text-sm text-slate-200 underline">
            Back to dashboard
          </Link>
        </div>

        {message && <div className="text-sm text-emerald-300">{message}</div>}
        {error && <div className="text-sm text-red-300">{error}</div>}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Users</div>
            {loading && <div className="text-xs text-slate-400">Loading...</div>}
          </div>
          {!loading && users.length === 0 && <div className="text-sm text-slate-400">No users found.</div>}
          {!loading && users.length > 0 && (
            <div className="space-y-2 text-sm">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <div className="font-semibold">{u.email}</div>
                    <div className="text-slate-400">
                      Role: {u.role} - Status: {STATUS_LABEL[u.account_status] ?? u.account_status}
                    </div>
                    {u.user_name && <div className="text-slate-500 text-xs">Username: {u.user_name}</div>}
                    <div className="text-slate-500 text-xs">Created: {formatDate(u.created_at)}</div>
                  </div>
                  <div className="flex gap-2">
                    {u.account_status !== 'banned' && (
                      <button
                        type="button"
                        disabled={updatingId === u.id}
                        onClick={() => setStatus(u.id, 'banned')}
                        className="px-3 py-2 rounded-lg border border-red-300/50 text-red-200 hover:border-red-200 disabled:opacity-60"
                      >
                        {updatingId === u.id ? 'Updating...' : 'Set banned'}
                      </button>
                    )}
                    {u.account_status === 'pending' && (
                      <button
                        type="button"
                        disabled={updatingId === u.id}
                        onClick={() => setStatus(u.id, 'active')}
                        className="px-3 py-2 rounded-lg border border-emerald-300/50 text-emerald-200 hover:border-emerald-200 disabled:opacity-60"
                      >
                        {updatingId === u.id ? 'Updating...' : 'Activate'}
                      </button>
                    )}
                    {u.account_status === 'banned' && (
                      <button
                        type="button"
                        disabled={updatingId === u.id}
                        onClick={() => setStatus(u.id, 'active')}
                        className="px-3 py-2 rounded-lg border border-emerald-300/50 text-emerald-200 hover:border-emerald-200 disabled:opacity-60"
                      >
                        {updatingId === u.id ? 'Updating...' : 'Unban (active)'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
