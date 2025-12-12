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

const formatDateLocal = (value) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString();
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
  const [fakeDetails, setFakeDetails] = useState({ userId: null, items: [], error: '', loading: false });

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

  const loadFakeDisasters = async (userId) => {
    setFakeDetails({ userId, items: [], error: '', loading: true });
    try {
      const res = await fetch(`/api/admin/users/fake-disasters?userId=${userId}`);
      const text = await res.text();
      const body = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setFakeDetails({ userId, items: [], error: body?.error || 'Failed to load fake disasters', loading: false });
      } else {
        setFakeDetails({ userId, items: body.disasters || [], error: '', loading: false });
      }
    } catch (err) {
      setFakeDetails({ userId, items: [], error: err?.message || 'Failed to load fake disasters', loading: false });
    }
  };

  return (
    <main className="min-h-screen bg-yellow-50 text-red-900 px-6 py-10 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-l font-bold uppercase tracking-[0.2em] text-red-800">Admin</div>
            <h1 className="text-3xl font-bold tracking-tight text-red-700">User management</h1>
            <p className="text-red-800 font-semibold text-l">Review users and resolve pending accounts.</p>
          </div>
        </div>

        {message && <div className="text-sm text-emerald-700">{message}</div>}
        {error && <div className="text-sm text-red-700">{error}</div>}

        <div className="rounded-2xl border border-red-200/70 bg-white p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-red-800">Users</div>
            {loading && <div className="text-xs text-red-800">Loading...</div>}
          </div>
          {!loading && users.length === 0 && <div className="text-sm text-red-800">No users found.</div>}
          {!loading && users.length > 0 && (
            <div className="space-y-2 text-sm">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="rounded-lg border border-red-200/70 bg-amber-50 px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <div className="font-semibold text-red-900">{u.email}</div>
                    <div className="text-red-800">
                      Role: {u.role} - Status: {STATUS_LABEL[u.account_status] ?? u.account_status}
                    </div>
                    {u.user_name && <div className="text-red-800 text-xs">Username: {u.user_name}</div>}
                    <div className="text-red-800 text-xs">Created: {formatDate(u.created_at)}</div>
                  </div>
                  <div className="flex gap-2">
                    {u.account_status !== 'banned' && (
                      <button
                        type="button"
                        disabled={updatingId === u.id}
                        onClick={() => setStatus(u.id, 'banned')}
                        className="px-3 py-2 rounded-lg border border-red-300 text-red-700 bg-white hover:bg-red-50 disabled:opacity-60"
                      >
                        {updatingId === u.id ? 'Updating...' : 'Set banned'}
                      </button>
                    )}
                    {u.account_status === 'pending' && (
                      <button
                        type="button"
                        disabled={updatingId === u.id}
                        onClick={() => setStatus(u.id, 'active')}
                        className="px-3 py-2 rounded-lg border border-red-300 text-red-700 bg-white hover:bg-red-50 disabled:opacity-60"
                      >
                        {updatingId === u.id ? 'Updating...' : 'Activate'}
                      </button>
                    )}
                    {u.account_status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => loadFakeDisasters(u.id)}
                        className="px-3 py-2 rounded-lg border border-red-300 text-red-700 bg-white hover:bg-red-50"
                      >
                        View fake reports
                      </button>
                    )}
                    {u.account_status === 'banned' && (
                      <button
                        type="button"
                        disabled={updatingId === u.id}
                        onClick={() => setStatus(u.id, 'active')}
                        className="px-3 py-2 rounded-lg border border-red-300 text-red-700 bg-white hover:bg-red-50 disabled:opacity-60"
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
        {fakeDetails.userId && (
          <div className="rounded-2xl border border-red-200/70 bg-white p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-red-800">
                Fake disasters reported by user #{fakeDetails.userId}
              </div>
              <button
                type="button"
                onClick={() => setFakeDetails({ userId: null, items: [], error: '', loading: false })}
                className="text-xs text-red-700 hover:text-red-600"
              >
                Close
              </button>
            </div>
            {fakeDetails.loading ? (
              <div className="text-sm text-red-800">Loading...</div>
            ) : fakeDetails.error ? (
              <div className="text-sm text-red-800">{fakeDetails.error}</div>
            ) : fakeDetails.items.length === 0 ? (
              <div className="text-sm text-red-800">No fake disasters found.</div>
            ) : (
              <div className="space-y-2 text-sm">
                {fakeDetails.items.map((d) => (
                  <div key={d.id} className="rounded-lg border border-red-200/70 bg-amber-50 px-3 py-2 flex justify-between gap-3">
                    <div>
                      <div className="font-semibold text-red-800 flex items-center gap-2">
                        <span className="text-xs uppercase tracking-[0.16em] text-red-700">{d.disaster_type_name || 'Disaster'}</span>
                        {d.title}
                      </div>
                      <div className="text-red-800 text-xs">
                        Severity: {d.severity} • {d.lat && d.lng ? `${d.lat.toFixed(3)}, ${d.lng.toFixed(3)}` : 'No coords'}
                      </div>
                      <div className="text-red-800 text-xs">
                        {formatDateLocal(d.occurred_at || d.created_at)}
                      </div>
                      {d.description && <div className="text-red-800 text-xs mt-1">{d.description}</div>}
                    </div>
                    <div className="text-red-800 text-xs">Status: {d.status}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
