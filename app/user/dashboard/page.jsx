'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DisasterMap = dynamic(() => import('./DisasterMap'), { ssr: false });

function formatDate(val) {
  if (!val) return 'Unknown time';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return 'Unknown time';
  return d.toLocaleString();
}

export default function UserDashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [recent, setRecent] = useState([]);
  const [recentError, setRecentError] = useState('');

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('sessionUser');
      if (raw) setUserInfo(JSON.parse(raw));
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!userInfo?.id && !userInfo?.email) return;
      try {
        const params = new URLSearchParams();
        if (userInfo.id) params.set('id', userInfo.id);
        else if (userInfo.email) params.set('email', userInfo.email);
        const res = await fetch(`/api/user/status?${params.toString()}`, { method: 'GET' });
        const text = await res.text();
        const body = text ? JSON.parse(text) : {};
        if (res.ok && body?.user) {
          const merged = { ...body.user, can_create_disaster: body.can_create_disaster };
          setUserInfo(merged);
          window.localStorage.setItem('sessionUser', JSON.stringify(merged));
          if (body.user.account_status === 'banned') {
            setStatusMessage('Your account has been banned. Access is limited.');
          } else if (body.user.account_status === 'pending') {
            setStatusMessage('Your account is pending; some actions are disabled.');
          } else {
            setStatusMessage('');
          }
        }
      } catch {
        // silent
      }
    };
    fetchStatus();
  }, [userInfo?.id, userInfo?.email]);

  useEffect(() => {
    let active = true;
    const loadRecent = async () => {
      try {
        const res = await fetch('/api/user/disasters');
        if (!res.ok) throw new Error('Failed to load recent disasters');
        const data = await res.json();
        if (!active) return;
        const list = (data.disasters ?? []).slice(0, 5);
        setRecent(list);
        setRecentError('');
      } catch (err) {
        if (active) {
          setRecent([]);
          setRecentError(err.message || 'Could not load recent disasters');
        }
      }
    };
    loadRecent();
    return () => {
      active = false;
    };
  }, []);

  const status = userInfo?.account_status ?? 'active';
  const role = userInfo?.role ?? 'user';
  const canCreate = Boolean(userInfo?.can_create_disaster ?? status === 'active');

  return (
    <main className="min-h-screen bg-yellow-50 text-red-900 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-red-800">User Dashboard</div>
            <h1 className="text-3xl font-bold tracking-tight text-red-700">Your Overview</h1>
            <p className="text-sm text-red-800">Account status and recent disaster activity.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200/70 bg-white p-4 shadow-sm">
          <div className="text-xs uppercase tracking-[0.14em] text-red-800">Account</div>
          <div className="text-xl font-semibold mt-1 text-red-700">{userInfo?.user_name || 'User name unavailable'}</div>
          <div className="text-sm text-red-800">{userInfo?.email || 'Email unavailable'}</div>
        </div>

        {statusMessage && (
          <div className="rounded-xl border border-red-200/70 bg-amber-50 px-4 py-3 text-sm text-red-800 shadow-sm">
            {statusMessage}
          </div>
        )}

        <div className="rounded-2xl border border-red-200/70 bg-white p-4 shadow-sm flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-red-700">Report a disaster</div>
            <div className="text-xs text-red-800">
              {canCreate
                ? 'Ready to file a new incident.'
                : status === 'banned'
                  ? 'Banned accounts cannot create or access new incidents.'
                  : 'Pending accounts cannot create new disasters.'}
            </div>
          </div>
          {canCreate ? (
            <Link
              href="/user/map"
              className="px-4 py-2 rounded-xl text-sm font-semibold transition bg-red-700 text-white shadow hover:bg-red-600"
              title="Open the map to file a report"
            >
              Open map to report
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-200 text-red-800 cursor-not-allowed"
              title="Awaiting approval to create incidents"
            >
              Creation locked
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-red-200/70 bg-white p-4 shadow-sm">
            <div className="text-xs uppercase tracking-[0.14em] text-red-800">Status</div>
            <div className="text-2xl font-bold capitalize text-red-700">{status}</div>
            <div className="text-sm text-red-800">Account status</div>
          </div>
          <div className="rounded-2xl border border-red-200/70 bg-white p-4 shadow-sm">
            <div className="text-xs uppercase tracking-[0.14em] text-red-800">Role</div>
            <div className="text-2xl font-bold capitalize text-red-700">{role}</div>
            <div className="text-sm text-red-800">Assigned role</div>
          </div>
          <div className="rounded-2xl border border-red-200/70 bg-white p-4 shadow-sm">
            <div className="text-xs uppercase tracking-[0.14em] text-red-800">Events</div>
            <div className="text-2xl font-bold text-red-700">{recent.length}</div>
            <div className="text-sm text-red-800">Recent disaster items</div>
          </div>
        </div>

        <DisasterMap />

        <div className="rounded-2xl border border-red-200/70 bg-white p-4 shadow-sm space-y-3">
          <div className="text-sm font-semibold text-red-700">Recent disasters</div>
          {recentError ? (
            <div className="rounded-lg border border-red-200/70 bg-amber-50 px-3 py-2 text-sm text-red-700">
              {recentError}
            </div>
          ) : recent.length === 0 ? (
            <div className="rounded-lg border border-red-200/70 bg-amber-50 px-3 py-2 text-sm text-red-800">
              No disasters to show yet.
            </div>
          ) : (
            <div className="space-y-2 text-sm text-red-900">
              {recent.map((d) => (
                <div key={d.id} className="rounded-lg border border-red-200/70 bg-amber-50 px-3 py-2 flex justify-between">
                  <div>
                    <div className="font-semibold text-red-700 flex items-center gap-2">
                      <span>{d.icon || '!'}</span>
                      {d.title}
                    </div>
                    <div className="text-red-800">Severity: {d.severity}</div>
                    <div className="text-red-800 text-xs">
                      {d.disaster_type_name || 'Disaster'} - {formatDate(d.occurred_at || d.created_at)}
                    </div>
                  </div>
                  <div className="text-red-800 text-xs text-right">
                    {typeof d.lat === 'number' && typeof d.lng === 'number'
                      ? `${d.lat.toFixed(3)}, ${d.lng.toFixed(3)}`
                      : 'No coords'}
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

