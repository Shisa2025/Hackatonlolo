'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
import { createTimeline } from 'animejs';
import {useRouter} from 'next/navigation';

export default function AdminDashboard() {
  const [clicks, setClicks] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [secretError, setSecretError] = useState('');
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const handleCursorClick = () => {
    const next = clicks + 1;
    if (next >= 7) {
      setClicks(0);
      setShowModal(true);
    } else {
      setClicks(next);
    }
  };

  const handleSecretSubmit = (e) => {
    e.preventDefault();
    if (secretInput.trim() === 'kaijuGo') {
      setSecretError('');
      setShowModal(false);
      window.location.href = '/kaiju';
    } else {
      setSecretError('Keyword incorrect');
    }
  };

  useEffect(() =>{
    const intro = createTimeline({
    });

    intro.add('#subheading1',{
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    });
    intro.add('#heading',{
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    }, '-=700');
    intro.add('#subheading2',{
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    }, '-=700');
    intro.add('#adminbutton1', {
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    }, '-=600');
    
    intro.add('#adminbutton2', {
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    }, '-=600');

    intro.add('#adminbutton3', {
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    }, '-=600');

    intro.add('#secretbutton', {
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    }, '-=600');

    intro.add('#adminbuttonstext',{
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutQuad'
    }, );

    intro.add('#secretimage',{
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutQuad'
    }, '-=600');
    
  }, []);

  async function handleUser() {
    if (disabled) return;
    setDisabled(true);

    // Optional: call your sign-out endpoint to clear server session
    try {
      await fetch('/info', { method: 'POST' });
    } catch (err) {
      // continue anyway
    }
    const user = createTimeline({
      autoplay: true
    });
    user.add('#all',{
      translateY: [0, -200],
      opacity:0,
      delay: 200,
      duration: 400,
      easing: 'easeInOutQuad'
    })

    setTimeout(() =>{
      router.push('/admin/users');
    }, 650);
    }

  async function handleDisaster() {
    if (disabled) return;
    setDisabled(true);

    // Optional: call your sign-out endpoint to clear server session
    try {
      await fetch('/info', { method: 'POST' });
    } catch (err) {
      // continue anyway
    }
    const user = createTimeline({
      autoplay: true
    });
    user.add('#all',{
      translateY: [0, -200],
      opacity:0,
      delay: 200,
      duration: 400,
      easing: 'easeInOutQuad'
    })

    setTimeout(() =>{
      router.push('/admin/disasters');
    }, 650);
    }

    async function handleDisasterType() {
    if (disabled) return;
    setDisabled(true);

    // Optional: call your sign-out endpoint to clear server session
    try {
      await fetch('/info', { method: 'POST' });
    } catch (err) {
      // continue anyway
    }
    const user = createTimeline({
      autoplay: true
    });
    user.add('#all',{
      translateY: [0, -200],
      opacity:0,
      delay: 200,
      duration: 400,
      easing: 'easeInOutQuad'
    })

    setTimeout(() =>{
      router.push('/admin/disaster-type');
    }, 650);
    }

  return (
    <main className="min-h-screen bg-yellow-50 text-slate-100 px-6 py-10">
      <div id='all' className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div id='subheading1' className="text-xs uppercase tracking-[0.15em] text-red-900 font-medium opacity-0">Admin Dashboard</div>
            <h1 id='heading' className="text-7xl font-bold tracking-tight text-red-700 py-2 opacity-0">Control Panel</h1>
            <p id='subheading2' className="text-red-900 text-m py-2 font-medium translate-x-12 opacity-0">Manage users and review disaster records.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <button
            id='adminbutton1'
            onClick={handleUser}
            disabled={disabled}
            aria-busy={disabled}
            className="group relative overflow-hidden rounded-2xl border border-red-200/50 bg-amber-50 shadow-md hover:shadow-2xl hover:-translate-y-1 opacity-0"
          >
            <div className="h-20 bg-gradient-to-r from-red-700 to-red-600 flex items-center px-4">
              <div className="h-10 w-10 rounded-xl bg-white/15 text-white flex items-center justify-center">
                <svg id='adminbuttonstext' xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 14a4 4 0 10-8 0m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2v-2m8 0v-1a4 4 0 10-8 0v1" />
                </svg>
              </div>
            </div>
            <div className="px-5 py-4 space-y-2 text-red-900">
              <div id='adminbuttonstext' className="text-xs uppercase tracking-[0.1em] text-red-700/80 opacity-0">Manage</div>
              <div id='adminbuttonstext' className="text-2xl font-semibold opacity-0">User management</div>
              <p id='adminbuttonstext' className="text-sm text-red-800/80 font-medium opacity-0">Review accounts, update statuses and manage roles.</p>
              <div id='adminbuttonstext' className="flex items-center gap-1 text-sm font-semibold text-red-700/80 group-hover:text-red-700 pt-1 opacity-0">
                <span>View</span>
                <svg id='adminbuttonstext' xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          <button
            href="/admin/disaster-type"
            onClick={handleDisasterType}
            disabled={disabled}
            aria-busy={disabled}
            id='adminbutton2'
            className="group relative overflow-hidden rounded-2xl border border-red-200/50 bg-amber-50 shadow-md hover:shadow-2xl hover:-translate-y-1 opacity-0"
          >
            <div className="h-20 bg-gradient-to-r from-red-700 to-red-600 flex items-center px-4">
              <div className="h-10 w-10 rounded-xl bg-white/15 text-white flex items-center justify-center">
                <svg id='adminbuttonstext' xmlns="http://www.w3.org/2000/svg" className="opacity-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M7 8h10M7 12h10M7 16h10" />
                  <circle cx="6" cy="8" r="0.5" fill="currentColor" />
                  <circle cx="6" cy="12" r="0.5" fill="currentColor" />
                  <circle cx="6" cy="16" r="0.5" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className="px-5 py-4 space-y-2 text-red-900">
              <div id='adminbuttonstext' className="text-xs uppercase tracking-[0.1em] text-red-700/80 opacity-0">Manage</div>
              <div id='adminbuttonstext' className="text-2xl font-semibold opacity-0">Create disaster types</div>
              <p id='adminbuttonstext' className="text-sm text-red-800/80 font-medium opacity-0">Create and maintain disaster categories and emojis.</p>
              <div id='adminbuttonstext' className=" opacity-0 flex items-center gap-1 text-sm font-semibold text-red-700/80 group-hover:text-red-700 pt-1">
                <span>View</span>
                <svg id='adminbuttonstext' xmlns="http://www.w3.org/2000/svg" className="opacity-0 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          <button
            onClick={handleDisaster}
            disabled={disabled}
            aria-busy={disabled}
            id='adminbutton3'
            className="group relative overflow-hidden rounded-2xl border border-red-200/50 bg-amber-50 shadow-md hover:shadow-2xl hover:-translate-y-1 opacity-0"
          >
            <div className="h-20 bg-gradient-to-r from-red-700 to-red-600 flex items-center px-4">
              <div className="h-10 w-10 rounded-xl bg-white/15 text-white flex items-center justify-center">
                <svg id='adminbuttonstext' xmlns="http://www.w3.org/2000/svg" className="opacity-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 9v3.5m0 3h.01M4.5 18h15a.75.75 0 00.67-1.08l-7.5-14.77a.75.75 0 00-1.34 0L3.83 16.92A.75.75 0 004.5 18z" />
                </svg>
              </div>
            </div>
            <div className="px-5 py-4 space-y-2 text-red-900">
              <div id='adminbuttonstext' className="text-xs uppercase tracking-[0.1em] text-red-700/80 opacity-0">Manage</div>
              <div id='adminbuttonstext' className="opacity-0 text-2xl font-semibold">Disaster management</div>
              <p id='adminbuttonstext' className="opacity-0 text-sm text-red-800/80 font-medium">Review disasters and update status.</p>
              <div id='adminbuttonstext' className="opacity-0 flex items-center gap-1 text-sm font-semibold text-red-700/80 group-hover:text-red-700 pt-1">
                <span>View</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
      <button
        type="button"
        id='secretbutton'
        onClick={handleCursorClick}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full border border-white/20 bg-white/80 shadow-lg hover:shadow-xl flex items-center justify-center overflow-hidden opacity-0"
        aria-label="Secret cursor trigger"
      >
        <img id='secretimage' src="/kaiju/index/kaijyu1.png" alt="cursor hint" className="h-10 w-10 object-contain opacity-0" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 shadow-2xl p-6 space-y-4">
            <div className="text-lg font-semibold">Enter keyword</div>
            <form className="space-y-3" onSubmit={handleSecretSubmit}>
              <input
                type="text"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Type keyword..."
                autoFocus
              />
              {secretError && <div className="text-sm text-red-600">{secretError}</div>}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSecretError('');
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-700 text-white font-semibold hover:bg-red-800"
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
